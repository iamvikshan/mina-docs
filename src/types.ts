// Cloudflare Workers environment bindings
export interface Env {
  // Doppler environment (dev/prd)
  DOPPLER_ENVIRONMENT?: string;

  // Discord OAuth
  CLIENT_ID?: string;
  CLIENT_SECRET?: string;

  // MongoDB (native driver - requires nodejs_compat flag)
  // Database name is extracted from the URI path
  MONGO_CONNECTION?: string;

  // Session secret (optional - falls back to CLIENT_SECRET)
  SESSION_SECRET?: string;

  // KV Namespace for rate limiting and caching
  RATE_LIMIT?: KVNamespace;
  CACHE?: KVNamespace; // Alias for backward compatibility

  // D1 Database (optional future use)
  // DB?: D1Database;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  meta?: {
    cached?: boolean;
    cacheAge?: number;
    generatedAt: string;
  };
}

// Bot Stats types
export interface BotStats {
  guilds: number;
  members: number;
  channels: number;
  ping: number;
  uptime: number;
  status: 'online' | 'idle' | 'dnd' | 'invisible' | 'offline';
  presence?: {
    status: string;
    message: string;
    type: string;
    url: string;
  };
  lastUpdated: string;
}

// Uptime Monitor types
export interface Monitor {
  id: number;
  name: string;
  status: number; // 0 = down, 1 = up, 2 = pending
  uptime: number; // Percentage (0-100)
}

export interface UptimeStats {
  uptime: number;
  monitors: Monitor[];
  totalMonitors: number;
  downMonitors: number;
}

// Guild types (simplified for API)
export interface GuildSettings {
  guildId: string;
  prefix?: string;
  automod?: Record<string, unknown>;
  welcome?: Record<string, unknown>;
  ticket?: Record<string, unknown>;
  logs?: Record<string, unknown>;
}
