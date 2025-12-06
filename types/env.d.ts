/**
 * Cloudflare Workers environment bindings
 *
 * REQUIRED BINDINGS:
 * - CLIENT_ID: Discord OAuth client ID
 * - CLIENT_SECRET: Discord OAuth client secret
 * - MONGO_CONNECTION: MongoDB connection string
 * - SESSION_SECRET: Session encryption secret
 * - RATE_LIMIT: KV namespace for rate limiting
 * - CACHE: KV namespace for caching
 * - BOTS: KV namespace for bot data
 *
 * OPTIONAL BINDINGS:
 * - DOPPLER_ENVIRONMENT: Environment identifier (dev/prd)
 * - LOGS_WEBHOOK: Discord webhook for error logging
 */

declare interface Env {
  // Doppler environment (dev/prd)
  DOPPLER_ENVIRONMENT?: string;

  // Discord OAuth - REQUIRED for authentication
  CLIENT_ID: string;
  CLIENT_SECRET: string;

  // MongoDB - REQUIRED for database operations
  // Database name is extracted from URI path
  MONGO_CONNECTION: string;

  // Session secret - Optional for session management
  // If not provided, falls back to CLIENT_SECRET at runtime
  SESSION_SECRET?: string;

  // Discord webhook for logging (Shoutrrr format: discord://TOKEN@WEBHOOK_ID)
  LOGS_WEBHOOK?: string;

  // KV Namespaces - REQUIRED for core functionality
  RATE_LIMIT: KVNamespace;
  CACHE: KVNamespace; // Alias for backward compatibility
  BOTS: KVNamespace; // Bot registration and stats

  // D1 Database (optional future use)
  // DB?: D1Database;
}
