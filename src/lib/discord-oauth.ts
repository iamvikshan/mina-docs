/**
 * Discord OAuth2 Utilities
 *
 * Handles Discord OAuth2 flow for dashboard authentication.
 * Uses Discord's OAuth2 endpoints to authenticate users.
 */

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  avatar?: string;
  email?: string;
  verified?: boolean;
}

export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

const DISCORD_API = 'https://discord.com/api/v10';
const DISCORD_CDN = 'https://cdn.discordapp.com';

/**
 * Generate OAuth2 authorization URL
 */
export function getOAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify',
    state,
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCode(
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string
): Promise<DiscordTokenResponse> {
  const response = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Discord OAuth error: ${error}`);
  }

  return response.json();
}

/**
 * Get current user from Discord API
 */
export async function getDiscordUser(
  accessToken: string
): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Discord user');
  }

  return response.json();
}

/**
 * Refresh an access token
 */
export async function refreshToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<DiscordTokenResponse> {
  const response = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

/**
 * Revoke a token
 */
export async function revokeToken(
  clientId: string,
  clientSecret: string,
  token: string
): Promise<void> {
  await fetch(`${DISCORD_API}/oauth2/token/revoke`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      token,
    }),
  });
}

/**
 * Get user avatar URL
 */
export function getAvatarUrl(user: DiscordUser, size = 128): string {
  if (user.avatar) {
    const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `${DISCORD_CDN}/avatars/${user.id}/${user.avatar}.${ext}?size=${size}`;
  }

  // Default avatar based on discriminator or user ID
  const defaultIndex =
    user.discriminator === '0'
      ? (BigInt(user.id) >> 22n) % 6n
      : parseInt(user.discriminator) % 5;

  return `${DISCORD_CDN}/embed/avatars/${defaultIndex}.png`;
}

/**
 * Generate a cryptographically secure state token
 */
export function generateState(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Create a signed session token (JWT-like, but simpler)
 */
export async function createSessionToken(
  userId: string,
  secret: string,
  expiresIn = 7 * 24 * 60 * 60 // 7 days default
): Promise<string> {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };

  const payloadBase64 = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // Create signature using HMAC-SHA256
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payloadBase64)
  );

  const signatureBase64 = btoa(
    String.fromCharCode(...new Uint8Array(signature))
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Verify and decode a session token
 */
export async function verifySessionToken(
  token: string,
  secret: string
): Promise<{ sub: string; iat: number; exp: number } | null> {
  try {
    const [payloadBase64, signatureBase64] = token.split('.');
    if (!payloadBase64 || !signatureBase64) return null;

    // Verify signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode signature
    const signatureStr = signatureBase64.replace(/-/g, '+').replace(/_/g, '/');
    const signaturePadded =
      signatureStr + '='.repeat((4 - (signatureStr.length % 4)) % 4);
    const signatureBytes = Uint8Array.from(atob(signaturePadded), (c) =>
      c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      encoder.encode(payloadBase64)
    );

    if (!valid) return null;

    // Decode payload
    const payloadStr = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const payloadPadded =
      payloadStr + '='.repeat((4 - (payloadStr.length % 4)) % 4);
    const payload = JSON.parse(atob(payloadPadded));

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
