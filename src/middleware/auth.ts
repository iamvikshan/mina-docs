/**
 * Authentication Middleware
 *
 * Validates API keys from Authorization header and applies rate limiting.
 */

import type { Context, Next } from 'hono';
import type { Env } from '../types';
import { createMongoClient } from '../lib/mongodb';
import {
  findUserByApiKey,
  updateApiKeyUsage,
  type ApiKey,
  type UserWithApiKeys,
} from '../lib/api-keys';
import { checkRateLimit, rateLimitHeaders } from '../lib/rate-limit';
import { verifySessionToken } from '../lib/discord-oauth';
import { errors } from '../lib/response';

// Extend Hono context with auth info
declare module 'hono' {
  interface ContextVariableMap {
    user: UserWithApiKeys;
    apiKey: ApiKey;
    userId: string;
  }
}

/**
 * Middleware to require API key authentication
 * Use on routes that need API key auth
 */
export async function requireApiKey(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    return errors.unauthorized(c, 'Missing Authorization header');
  }

  if (!authHeader.startsWith('Bearer ')) {
    return errors.unauthorized(
      c,
      'Invalid Authorization format. Use: Bearer <api_key>'
    );
  }

  const apiKey = authHeader.slice(7).trim();

  if (!apiKey || !apiKey.startsWith('amina_')) {
    return errors.unauthorized(c, 'Invalid API key format');
  }

  // Get MongoDB client
  const db = createMongoClient(c.env);
  if (!db) {
    console.error('MongoDB not configured');
    return errors.internal(c, 'Authentication service unavailable');
  }

  try {
    // Find user by API key
    const result = await findUserByApiKey(db, apiKey);

    if (!result) {
      return errors.unauthorized(c, 'Invalid API key');
    }

    const { user, apiKey: key } = result;

    // Check if key is expired
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
      return errors.unauthorized(c, 'API key has expired');
    }

    // Check rate limit
    const rateLimitKey = `api:${user._id}:${key.id}`;
    const rateLimit = await checkRateLimit(
      c.env.CACHE,
      rateLimitKey,
      key.rateLimit
    );

    // Add rate limit headers
    const headers = rateLimitHeaders(rateLimit);
    Object.entries(headers).forEach(([name, value]) => {
      if (value) c.header(name, value);
    });

    if (!rateLimit.allowed) {
      return errors.rateLimit(
        c,
        `Rate limit exceeded. Try again in ${headers['Retry-After']} seconds`
      );
    }

    // Set user and key in context
    c.set('user', user);
    c.set('apiKey', key);
    c.set('userId', user._id);

    await next();

    // Update usage stats after successful request (non-blocking)
    c.executionCtx.waitUntil(updateApiKeyUsage(db, user._id, key.id));
  } catch (error) {
    console.error('Auth error:', error);
    return errors.internal(c, 'Authentication failed');
  }
}

/**
 * Middleware to require session authentication (for dashboard)
 * Uses cookie-based session token
 */
export async function requireSession(
  c: Context<{ Bindings: Env }>,
  next: Next
) {
  const sessionCookie = c.req
    .header('Cookie')
    ?.split(';')
    .find((c) => c.trim().startsWith('session='))
    ?.split('=')[1];

  if (!sessionCookie) {
    // Redirect to login
    return c.redirect('/dashboard/login');
  }

  const secret = c.env.SESSION_SECRET || c.env.CLIENT_SECRET;
  if (!secret) {
    return errors.internal(c, 'Session configuration error');
  }

  const payload = await verifySessionToken(sessionCookie, secret);

  if (!payload) {
    // Clear invalid cookie and redirect
    c.header(
      'Set-Cookie',
      'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    );
    return c.redirect('/dashboard/login');
  }

  c.set('userId', payload.sub);
  await next();
}

/**
 * Optional API key middleware - doesn't require auth but extracts user if present
 */
export async function optionalApiKey(
  c: Context<{ Bindings: Env }>,
  next: Next
) {
  const authHeader = c.req.header('Authorization');

  if (authHeader?.startsWith('Bearer ')) {
    const apiKey = authHeader.slice(7).trim();

    if (apiKey.startsWith('amina_')) {
      const db = createMongoClient(c.env);

      if (db) {
        try {
          const result = await findUserByApiKey(db, apiKey);

          if (result && !result.apiKey.revoked) {
            const { user, apiKey: key } = result;

            // Check expiration
            if (!key.expiresAt || new Date(key.expiresAt) >= new Date()) {
              c.set('user', user);
              c.set('apiKey', key);
              c.set('userId', user._id);
            }
          }
        } catch (error) {
          console.warn('Optional auth failed:', error);
        }
      }
    }
  }

  await next();
}

/**
 * Check if the authenticated user has a specific permission
 */
export function hasPermission(
  c: Context<{ Bindings: Env }>,
  permission: string
): boolean {
  const apiKey = c.get('apiKey');
  if (!apiKey) return false;

  return (
    apiKey.permissions.includes('all') ||
    apiKey.permissions.includes(permission)
  );
}

/**
 * Middleware factory to check for specific permission
 */
export function requirePermission(permission: string) {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    if (!hasPermission(c, permission)) {
      return errors.forbidden(c, `Missing required permission: ${permission}`);
    }
    await next();
  };
}
