import type { BotStats, Env } from '../types';

// In-memory cache for edge (per isolate)
let botStatsCache: { data: BotStats; timestamp: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Fetch bot statistics from external bot API or database
 * The bot updates stats every 10 minutes via presence handler
 */
export async function getBotStats(
  env: Env
): Promise<BotStats & { cached: boolean; cacheAge?: number }> {
  // Check in-memory cache first
  if (botStatsCache && Date.now() - botStatsCache.timestamp < CACHE_DURATION) {
    return {
      ...botStatsCache.data,
      cached: true,
      cacheAge: Math.floor((Date.now() - botStatsCache.timestamp) / 1000),
    };
  }

  // Check KV cache if available
  if (env.CACHE) {
    const cached = await env.CACHE.get('bot-stats', 'json');
    if (cached) {
      const data = cached as BotStats & { timestamp: number };
      const age = Date.now() - data.timestamp;
      if (age < CACHE_DURATION) {
        botStatsCache = { data, timestamp: data.timestamp };
        return {
          ...data,
          cached: true,
          cacheAge: Math.floor(age / 1000),
        };
      }
    }
  }

  // Fetch from bot API endpoint (the bot exposes this)
  // In production, this would be your bot's stats endpoint
  const botApiUrl = env.BOT_API_URL;

  if (!botApiUrl) {
    // Return default/fallback stats if no bot API configured
    // This allows the API to work even if bot isn't running
    return {
      guilds: 0,
      members: 0,
      channels: 0,
      ping: 0,
      uptime: 0,
      status: 'offline' as const,
      lastUpdated: new Date().toISOString(),
      cached: false,
    };
  }

  try {
    const response = await fetch(`${botApiUrl}/stats`, {
      headers: {
        'User-Agent': 'Amina-API/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Bot API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      guilds?: number;
      users?: number;
      channels?: number;
      ping?: number;
      uptime?: number;
      status?: string;
      presence?: {
        status: string;
        message: string;
        type: string;
        url: string;
      };
      lastUpdated?: string;
    };

    const stats: BotStats = {
      guilds: data.guilds || 0,
      members: data.users || 0,
      channels: data.channels || 0,
      ping: data.ping || 0,
      uptime: data.uptime || 0,
      status: (data.status as BotStats['status']) || 'online',
      presence: data.presence,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
    };

    // Update caches
    botStatsCache = { data: stats, timestamp: Date.now() };

    if (env.CACHE) {
      await env.CACHE.put(
        'bot-stats',
        JSON.stringify({ ...stats, timestamp: Date.now() }),
        {
          expirationTtl: 600, // 10 minutes
        }
      );
    }

    return { ...stats, cached: false };
  } catch (error) {
    console.error('Failed to fetch bot stats:', error);

    // Return cached data if available, even if stale
    if (botStatsCache) {
      return {
        ...botStatsCache.data,
        cached: true,
        cacheAge: Math.floor((Date.now() - botStatsCache.timestamp) / 1000),
      };
    }

    // Return fallback
    return {
      guilds: 0,
      members: 0,
      channels: 0,
      ping: 0,
      uptime: 0,
      status: 'offline' as const,
      lastUpdated: new Date().toISOString(),
      cached: false,
    };
  }
}
