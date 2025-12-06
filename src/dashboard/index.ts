/**
 * Dashboard Routes
 *
 * Handles the lightweight API key management dashboard.
 * Uses Discord OAuth for authentication.
 */

import { Hono } from 'hono';
import { createMongoClient } from '../lib/mongodb';
import {
  getOAuthUrl,
  exchangeCode,
  getDiscordUser,
  generateState,
  createSessionToken,
  verifySessionToken,
} from '../lib/discord-oauth';
import {
  createApiKeyForUser,
  getUserApiKeys,
  revokeApiKey,
} from '../lib/api-keys';
import { loginPage, dashboardPage, errorPage } from './templates';

const dashboard = new Hono<{ Bindings: Env }>();

// Helper to get session user ID
async function getSessionUserId(c: {
  req: { header: (name: string) => string | undefined };
  env: Env;
}): Promise<string | null> {
  const cookies = c.req.header('Cookie');
  const sessionCookie = cookies
    ?.split(';')
    .find((c) => c.trim().startsWith('session='))
    ?.split('=')[1];

  if (!sessionCookie) return null;

  const secret = c.env.SESSION_SECRET || c.env.CLIENT_SECRET;
  if (!secret) return null;

  const payload = await verifySessionToken(sessionCookie, secret);
  return payload?.sub || null;
}

// Login page
dashboard.get('/login', async (c) => {
  const userId = await getSessionUserId(c);
  if (userId) {
    return c.redirect('/dashboard');
  }

  const error = c.req.query('error');
  return c.html(loginPage(error ? decodeURIComponent(error) : undefined));
});

// Discord OAuth start
dashboard.get('/auth/discord', async (c) => {
  const clientId = c.env.CLIENT_ID;
  if (!clientId) {
    return c.html(
      errorPage('Discord OAuth not configured', 'Configuration Error')
    );
  }

  const state = generateState();
  const redirectUri = new URL('/dashboard/auth/callback', c.req.url).toString();
  const authUrl = getOAuthUrl(clientId, redirectUri, state);

  // Store state in cookie for validation
  c.header(
    'Set-Cookie',
    `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );

  return c.redirect(authUrl);
});

// Discord OAuth callback
dashboard.get('/auth/callback', async (c) => {
  const { code, state, error: oauthError } = c.req.query();

  if (oauthError) {
    return c.redirect(
      `/dashboard/login?error=${encodeURIComponent(oauthError)}`
    );
  }

  if (!code) {
    return c.redirect('/dashboard/login?error=No+authorization+code+received');
  }

  // Validate state
  const cookies = c.req.header('Cookie');
  const storedState = cookies
    ?.split(';')
    .find((c) => c.trim().startsWith('oauth_state='))
    ?.split('=')[1];

  if (!storedState || storedState !== state) {
    return c.redirect('/dashboard/login?error=Invalid+state+parameter');
  }

  const clientId = c.env.CLIENT_ID;
  const clientSecret = c.env.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return c.html(
      errorPage('Discord OAuth not configured', 'Configuration Error')
    );
  }

  try {
    const redirectUri = new URL(
      '/dashboard/auth/callback',
      c.req.url
    ).toString();

    // Exchange code for token
    const tokens = await exchangeCode(
      clientId,
      clientSecret,
      code,
      redirectUri
    );

    // Get Discord user
    const discordUser = await getDiscordUser(tokens.access_token);

    // Create session token
    const secret = c.env.SESSION_SECRET || clientSecret;
    const sessionToken = await createSessionToken(discordUser.id, secret);

    // Store/update user in MongoDB
    const db = createMongoClient(c.env);
    if (db) {
      await db.updateOne(
        'users',
        { _id: discordUser.id },
        {
          $set: {
            username: discordUser.global_name || discordUser.username,
            discriminator: discordUser.discriminator,
            avatar: discordUser.avatar,
            updated_at: new Date(),
          },
          $setOnInsert: {
            _id: discordUser.id,
            created_at: new Date(),
          },
        },
        { upsert: true }
      );
    }

    // Set session cookie and clear state cookie
    const cookieOptions =
      'Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800'; // 7 days
    c.header(
      'Set-Cookie',
      [
        `session=${sessionToken}; ${cookieOptions}`,
        'oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
      ].join(', ')
    );

    return c.redirect('/dashboard');
  } catch (error) {
    console.error('OAuth callback error:', error);
    return c.redirect(
      `/dashboard/login?error=${encodeURIComponent('Authentication failed')}`
    );
  }
});

// Logout
dashboard.get('/logout', async (c) => {
  c.header(
    'Set-Cookie',
    'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
  );
  return c.redirect('/dashboard/login');
});

// Dashboard home (protected)
dashboard.get('/', async (c) => {
  const userId = await getSessionUserId(c);
  if (!userId) {
    return c.redirect('/dashboard/login');
  }

  const db = createMongoClient(c.env);
  if (!db) {
    return c.html(errorPage('Database not configured', 'Configuration Error'));
  }

  try {
    // Get user info
    const user = await db.findOne<{
      _id: string;
      username?: string;
      avatar?: string;
    }>('users', { _id: userId });

    if (!user) {
      c.header(
        'Set-Cookie',
        'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
      );
      return c.redirect('/dashboard/login');
    }

    // Get API keys
    const keys = await getUserApiKeys(db, userId);

    // Check for newly created key in query
    const newKey = c.req.query('newKey');

    return c.html(
      dashboardPage(
        {
          id: user._id,
          username: user.username || 'User',
          avatar: user.avatar,
        },
        keys.map((k) => ({
          ...k,
          createdAt: new Date(k.createdAt),
          usage: {
            total: k.usage.total,
            lastUsed: k.usage.lastUsed ? new Date(k.usage.lastUsed) : null,
          },
        })),
        newKey
      )
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return c.html(errorPage('Failed to load dashboard', 'Error'));
  }
});

// Create API key
dashboard.post('/keys/create', async (c) => {
  const userId = await getSessionUserId(c);
  if (!userId) {
    return c.redirect('/dashboard/login');
  }

  const db = createMongoClient(c.env);
  if (!db) {
    return c.html(errorPage('Database not configured', 'Configuration Error'));
  }

  try {
    const formData = await c.req.formData();
    const name = formData.get('name')?.toString() || 'Unnamed Key';

    // Limit number of keys per user
    const existingKeys = await getUserApiKeys(db, userId);
    const activeKeys = existingKeys.filter((k) => !k.revoked);

    if (activeKeys.length >= 5) {
      return c.html(
        errorPage(
          'Maximum 5 active API keys allowed. Revoke an existing key first.',
          'Limit Reached'
        )
      );
    }

    const { key } = await createApiKeyForUser(db, userId, { name });

    // Redirect with the new key (only shown once)
    return c.redirect(`/dashboard?newKey=${encodeURIComponent(key)}`);
  } catch (error) {
    console.error('Create key error:', error);
    return c.html(errorPage('Failed to create API key', 'Error'));
  }
});

// Revoke API key
dashboard.post('/keys/:keyId/revoke', async (c) => {
  const userId = await getSessionUserId(c);
  if (!userId) {
    return c.redirect('/dashboard/login');
  }

  const db = createMongoClient(c.env);
  if (!db) {
    return c.html(errorPage('Database not configured', 'Configuration Error'));
  }

  try {
    const keyId = c.req.param('keyId');
    await revokeApiKey(db, userId, keyId);
    return c.redirect('/dashboard');
  } catch (error) {
    console.error('Revoke key error:', error);
    return c.html(errorPage('Failed to revoke API key', 'Error'));
  }
});

export default dashboard;
