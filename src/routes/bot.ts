import { Hono } from 'hono';
import type { Env } from '../types';
import { getBotStats } from '../lib/bot-stats';
import { getUptimeStats } from '../lib/uptime';
import { success, errors } from '../lib/response';

const bot = new Hono<{ Bindings: Env }>();

/**
 * GET /bot/metrics
 * Combined bot statistics and uptime metrics
 * Used by the dashboard homepage
 *
 * Query params (optional):
 * - uptime_url: Uptime Kuma base URL (default: https://status.vikshan.me)
 * - uptime_slug: Status page slug (default: amina)
 * - bot_url: Bot API URL for stats
 */
bot.get('/metrics', async (c) => {
  try {
    const uptimeUrl = c.req.query('uptime_url');
    const uptimeSlug = c.req.query('uptime_slug');
    const botUrl = c.req.query('bot_url');

    // Fetch both in parallel
    const [botStats, uptimeStats] = await Promise.all([
      getBotStats(c.env, { url: botUrl }),
      getUptimeStats(c.env, { url: uptimeUrl, slug: uptimeSlug }),
    ]);

    const payload = {
      guilds: botStats.guilds,
      members: botStats.members,
      channels: botStats.channels,
      ping: botStats.ping,
      uptime: uptimeStats.uptime,
      uptimeHours: Math.floor(botStats.uptime / 3600),
      status: botStats.status,
      presence: botStats.presence,
    };

    return success(c, payload, {
      cached: botStats.cached || uptimeStats.cached,
      cacheAge: Math.max(botStats.cacheAge ?? 0, uptimeStats.cacheAge ?? 0),
    });
  } catch (error) {
    console.error('[/bot/metrics] Failed to fetch metrics:', error);
    return errors.internal(c, 'Failed to load metrics');
  }
});

/**
 * GET /bot/status
 * Uptime and monitor status information
 *
 * Query params (optional):
 * - url: Uptime Kuma base URL (default: https://status.vikshan.me)
 * - slug: Status page slug (default: amina)
 */
bot.get('/status', async (c) => {
  try {
    const url = c.req.query('url');
    const slug = c.req.query('slug');

    const stats = await getUptimeStats(c.env, { url, slug });

    const payload = {
      uptime: stats.uptime,
      totalMonitors: stats.totalMonitors,
      downMonitors: stats.downMonitors,
      monitors: stats.monitors,
    };

    return success(c, payload, {
      cached: stats.cached,
      cacheAge: stats.cacheAge,
    });
  } catch (error) {
    console.error('[/bot/status] Failed to fetch status:', error);
    return errors.internal(c, 'Failed to load status information');
  }
});

/**
 * GET /bot/stats
 * Raw bot statistics only
 *
 * Query params (optional):
 * - url: Bot API URL
 */
bot.get('/stats', async (c) => {
  try {
    const url = c.req.query('url');
    const stats = await getBotStats(c.env, { url });

    return success(c, stats, {
      cached: stats.cached,
      cacheAge: stats.cacheAge,
    });
  } catch (error) {
    console.error('[/bot/stats] Failed to fetch stats:', error);
    return errors.internal(c, 'Failed to load bot statistics');
  }
});

/**
 * GET /bot/health
 * Simple health check endpoint
 */
bot.get('/health', (c) => {
  return success(c, {
    status: 'healthy',
    service: 'amina-api',
    timestamp: new Date().toISOString(),
  });
});

export default bot;
