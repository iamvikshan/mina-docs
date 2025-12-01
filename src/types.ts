// Cloudflare Workers environment bindings
export interface Env {
  // Environment
  ENVIRONMENT: string;

  // External API URLs
  UPTIME_KUMA_URL?: string;
  UPTIME_KUMA_SLUG?: string;
  BOT_API_URL?: string;

  // Discord OAuth (for auth endpoints)
  DISCORD_CLIENT_ID?: string;
  DISCORD_CLIENT_SECRET?: string;
  DISCORD_BOT_TOKEN?: string;

  // MongoDB connection (if using external)
  MONGODB_URI?: string;

  // KV Namespace for caching (optional)
  CACHE?: KVNamespace;

  // D1 Database (optional)
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
