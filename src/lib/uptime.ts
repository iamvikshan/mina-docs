import type { Env, Monitor, UptimeStats } from '../types';

// In-memory cache for edge (per isolate)
let uptimeCache: { data: UptimeStats; timestamp: number; key: string } | null =
  null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Default fallback when Uptime Kuma is unavailable
const FALLBACK_STATS: UptimeStats = {
  uptime: 99.9,
  monitors: [],
  totalMonitors: 0,
  downMonitors: 0,
};

export interface UptimeOptions {
  url?: string; // Uptime Kuma base URL
  slug?: string; // Status page slug
}

/**
 * Fetch uptime statistics from Uptime Kuma Status Page API
 * Gracefully handles when Uptime Kuma is down/unavailable
 *
 * @param env - Environment bindings
 * @param options - Optional URL and slug (can be passed via query params)
 */
export async function getUptimeStats(
  env: Env,
  options?: UptimeOptions
): Promise<
  UptimeStats & { cached: boolean; cacheAge?: number; unavailable?: boolean }
> {
  const uptimeKumaUrl = options?.url || 'https://status.vikshan.me';
  const statusPageSlug = options?.slug || 'amina';
  const cacheKey = `${uptimeKumaUrl}:${statusPageSlug}`;

  // Check in-memory cache first
  if (
    uptimeCache &&
    uptimeCache.key === cacheKey &&
    Date.now() - uptimeCache.timestamp < CACHE_DURATION
  ) {
    return {
      ...uptimeCache.data,
      cached: true,
      cacheAge: Math.floor((Date.now() - uptimeCache.timestamp) / 1000),
    };
  }

  // Check KV cache if available
  if (env.CACHE) {
    const cached = await env.CACHE.get(`uptime-stats:${cacheKey}`, 'json');
    if (cached) {
      const data = cached as UptimeStats & { timestamp: number };
      const age = Date.now() - data.timestamp;
      if (age < CACHE_DURATION) {
        uptimeCache = { data, timestamp: data.timestamp, key: cacheKey };
        return {
          ...data,
          cached: true,
          cacheAge: Math.floor(age / 1000),
        };
      }
    }
  }

  try {
    // Create abort controller for timeout (10 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // Fetch status page to get monitor list
    const statusPageResponse = await fetch(
      `${uptimeKumaUrl}/api/status-page/${statusPageSlug}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!statusPageResponse.ok) {
      console.warn(`Uptime Kuma returned ${statusPageResponse.status}`);
      return { ...FALLBACK_STATS, cached: false, unavailable: true };
    }

    const statusPageData = (await statusPageResponse.json()) as {
      publicGroupList?: Array<{
        monitorList?: Array<{ id: number; name: string; type?: string }>;
      }>;
    };
    const publicGroupList = statusPageData.publicGroupList || [];

    // Extract all monitors from all groups
    const monitorList: Array<{ id: number; name: string; type?: string }> = [];
    for (const group of publicGroupList) {
      if (group.monitorList && Array.isArray(group.monitorList)) {
        monitorList.push(...group.monitorList);
      }
    }

    if (monitorList.length === 0) {
      return { ...FALLBACK_STATS, cached: false };
    }

    // Fetch heartbeat/uptime data (with same timeout)
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 10000);

    const heartbeatResponse = await fetch(
      `${uptimeKumaUrl}/api/status-page/heartbeat/${statusPageSlug}`,
      { signal: controller2.signal }
    );
    clearTimeout(timeoutId2);

    if (!heartbeatResponse.ok) {
      console.warn(
        `Uptime Kuma heartbeat returned ${heartbeatResponse.status}`
      );
      return { ...FALLBACK_STATS, cached: false, unavailable: true };
    }

    const heartbeatData = (await heartbeatResponse.json()) as {
      uptimeList?: Record<string, number>;
      heartbeatList?: Record<string, Array<{ status: number }>>;
    };
    const uptimeList = heartbeatData.uptimeList || {};
    const heartbeatList = heartbeatData.heartbeatList || {};

    const allMonitors: Monitor[] = [];
    let aminaUptimeTotal = 0;
    let aminaCount = 0;

    // Process all monitors
    for (const monitor of monitorList) {
      const id = Number(monitor.id);
      const name = String(monitor.name);
      const type = String(monitor.type || 'unknown');

      // Skip group monitors
      if (type === 'group') {
        continue;
      }

      // Get current status from latest heartbeat
      const heartbeats = heartbeatList[id];
      let status = 1; // default to up
      if (heartbeats && Array.isArray(heartbeats) && heartbeats.length > 0) {
        status = heartbeats[heartbeats.length - 1]?.status ?? 1;
      }

      // Get uptime percentage (24h key)
      const uptimeKey = `${id}_24`;
      let uptimePercent = uptimeList[uptimeKey] ?? 100;
      uptimePercent = Math.round(uptimePercent * 100) / 100;

      allMonitors.push({
        id,
        name,
        status,
        uptime: uptimePercent,
      });

      // Calculate average for "amina" prefixed monitors
      const nameLower = name.toLowerCase();
      if (nameLower.startsWith('amina')) {
        aminaUptimeTotal += uptimePercent;
        aminaCount++;
      }
    }

    // Calculate average uptime
    const averageUptime =
      aminaCount > 0
        ? Math.round((aminaUptimeTotal / aminaCount) * 100) / 100
        : 99.9;

    const result: UptimeStats = {
      uptime: averageUptime,
      monitors: allMonitors,
      totalMonitors: allMonitors.length,
      downMonitors: allMonitors.filter((m) => m.status !== 1).length,
    };

    // Update caches
    uptimeCache = { data: result, timestamp: Date.now(), key: cacheKey };

    if (env.CACHE) {
      await env.CACHE.put(
        `uptime-stats:${cacheKey}`,
        JSON.stringify({ ...result, timestamp: Date.now() }),
        { expirationTtl: 600 }
      );
    }

    return { ...result, cached: false };
  } catch (error) {
    // Handle timeout, network errors, etc.
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    console.warn(
      `Uptime Kuma ${isTimeout ? 'timeout' : 'error'}:`,
      error instanceof Error ? error.message : error
    );

    // Return cached data if available (even if stale)
    if (uptimeCache && uptimeCache.key === cacheKey) {
      return {
        ...uptimeCache.data,
        cached: true,
        cacheAge: Math.floor((Date.now() - uptimeCache.timestamp) / 1000),
        unavailable: true,
      };
    }

    // Return fallback
    return { ...FALLBACK_STATS, cached: false, unavailable: true };
  }
}
