/**
 * API Key Management
 *
 * API keys are:
 * - Generated with crypto.randomUUID() + random bytes
 * - Prefixed with `amina_` for easy identification
 * - Stored as SHA-256 hashes (never store raw keys)
 * - Have a visible prefix for user reference
 */

import type { MongoDB } from './mongodb';

export interface ApiKey {
  id: string; // Short identifier (for reference)
  name: string; // User-defined name
  keyHash: string; // SHA-256 hash of the full key
  prefix: string; // First 12 chars for display (amina_xxxx)
  permissions: string[]; // Scopes: 'images', 'stats', 'all'
  rateLimit: {
    requests: number; // Max requests per window
    window: number; // Window in seconds
  };
  usage: {
    total: number; // Total requests made
    lastUsed: Date | null; // Last request timestamp
  };
  createdAt: Date;
  expiresAt: Date | null; // Optional expiration
  revoked: boolean;
}

export interface UserWithApiKeys {
  _id: string; // Discord user ID
  username?: string;
  apiKeys?: ApiKey[];
}

// Default rate limit: 60 requests per minute
const DEFAULT_RATE_LIMIT = {
  requests: 60,
  window: 60,
};

/**
 * Generate a secure random API key
 * Format: amina_<32 random chars>
 */
export async function generateApiKey(): Promise<{
  key: string;
  prefix: string;
  hash: string;
}> {
  // Generate 24 random bytes (will be 32 chars in base64url)
  const randomBytes = new Uint8Array(24);
  crypto.getRandomValues(randomBytes);

  // Convert to base64url (URL-safe base64 without padding)
  const base64 = btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const key = `amina_${base64}`;
  const prefix = key.slice(0, 12); // "amina_xxxxxx"
  const hash = await hashApiKey(key);

  return { key, prefix, hash };
}

/**
 * Hash an API key using SHA-256
 */
export async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a new API key for a user
 */
export async function createApiKeyForUser(
  db: MongoDB,
  userId: string,
  options: {
    name: string;
    permissions?: string[];
    rateLimit?: { requests: number; window: number };
    expiresAt?: Date | null;
  }
): Promise<{ key: string; apiKey: ApiKey }> {
  const { key, prefix, hash } = await generateApiKey();

  const apiKey: ApiKey = {
    id: `key_${crypto.randomUUID().slice(0, 8)}`,
    name: options.name,
    keyHash: hash,
    prefix,
    permissions: options.permissions || ['all'],
    rateLimit: options.rateLimit || DEFAULT_RATE_LIMIT,
    usage: {
      total: 0,
      lastUsed: null,
    },
    createdAt: new Date(),
    expiresAt: options.expiresAt || null,
    revoked: false,
  };

  // Add key to user's apiKeys array
  await db.updateOne(
    'users',
    { _id: userId },
    {
      $push: { apiKeys: apiKey },
      $setOnInsert: { _id: userId, created_at: new Date() },
      $set: { updated_at: new Date() },
    },
    { upsert: true }
  );

  return { key, apiKey };
}

/**
 * Find a user by API key hash
 */
export async function findUserByApiKey(
  db: MongoDB,
  apiKey: string
): Promise<{ user: UserWithApiKeys; apiKey: ApiKey } | null> {
  const hash = await hashApiKey(apiKey);

  const user = await db.findOne<UserWithApiKeys>('users', {
    'apiKeys.keyHash': hash,
    'apiKeys.revoked': false,
  });

  if (!user || !user.apiKeys) {
    return null;
  }

  const key = user.apiKeys.find((k) => k.keyHash === hash && !k.revoked);
  if (!key) {
    return null;
  }

  return { user, apiKey: key };
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(
  db: MongoDB,
  userId: string,
  keyId: string
): Promise<boolean> {
  const result = await db.updateOne(
    'users',
    { _id: userId, 'apiKeys.id': keyId },
    {
      $set: {
        'apiKeys.$.revoked': true,
        updated_at: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

/**
 * Get all API keys for a user (without hashes)
 */
export async function getUserApiKeys(
  db: MongoDB,
  userId: string
): Promise<Omit<ApiKey, 'keyHash'>[]> {
  const user = await db.findOne<UserWithApiKeys>(
    'users',
    { _id: userId },
    { projection: { apiKeys: 1 } }
  );

  if (!user?.apiKeys) {
    return [];
  }

  // Remove keyHash from response for security
  return user.apiKeys.map(({ keyHash, ...rest }) => rest);
}

/**
 * Update API key usage
 */
export async function updateApiKeyUsage(
  db: MongoDB,
  userId: string,
  keyId: string
): Promise<void> {
  await db.updateOne(
    'users',
    { _id: userId, 'apiKeys.id': keyId },
    {
      $inc: { 'apiKeys.$.usage.total': 1 },
      $set: { 'apiKeys.$.usage.lastUsed': new Date() },
    }
  );
}

/**
 * Delete an API key permanently
 */
export async function deleteApiKey(
  db: MongoDB,
  userId: string,
  keyId: string
): Promise<boolean> {
  const result = await db.updateOne(
    'users',
    { _id: userId },
    {
      $pull: { apiKeys: { id: keyId } },
      $set: { updated_at: new Date() },
    }
  );

  return result.modifiedCount > 0;
}
