import { Hono } from 'hono';
import type { Env } from './types';
import { cors, logger, cacheControl, errorHandler } from './middleware';
import { success } from './lib/response';

// Import routes
import botRoutes from './routes/bot';
import guildRoutes from './routes/guild';
import imagesRoutes from './routes/images';

// Create main app
const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use('*', errorHandler);
app.use('*', cors);
app.use('*', logger);
app.use('*', cacheControl);

// Root endpoint
app.get('/', (c) => {
  return success(c, {
    name: 'Amina API',
    version: '1.0.0',
    description: 'API for Amina Discord Bot',
    documentation: 'https://docs.4mina.app/api',
    endpoints: {
      bot: '/bot/*',
      guild: '/guild/*',
      images: '/images/*',
    },
  });
});

// Health check (for uptime monitoring)
app.get('/health', (c) => {
  return success(c, {
    status: 'healthy',
    service: 'amina-api',
    environment: c.env.ENVIRONMENT || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
app.route('/bot', botRoutes);
app.route('/guild', guildRoutes);
app.route('/images', imagesRoutes);

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: {
        message: 'Endpoint not found',
        code: 'NOT_FOUND',
      },
      meta: {
        generatedAt: new Date().toISOString(),
      },
    },
    404
  );
});

// Export for Cloudflare Workers
export default app;
