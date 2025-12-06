/**
 * Webhook Routes
 *
 * Handles incoming webhooks from various providers and transforms them
 * to Discord webhook format (similar to skyhookapi.com).
 *
 * Usage: POST /webhooks/:id/:token/:provider
 * Example: POST /webhooks/1234567890/abcdef123456.../doppler
 */

import { Hono } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { Env } from '../types';
import { error, success } from '../lib/response';
import { transformDopplerPayload } from '../lib/webhooks/doppler';
import { webhookTransformerPage } from '../lib/webhooks/templates';
import { validateWebhookParams } from '../middleware/webhooks';
import { z } from 'zod';

const dopplerSchema = z.object({
  config: z.object({
    name: z.string(),
    environment: z.string(),
  }),
  diff: z.object({
    added: z.array(z.string()),
    updated: z.array(z.string()),
    removed: z.array(z.string()),
  }),
  project: z.object({
    name: z.string(),
    id: z.string(),
    workspace: z.string().optional(),
    workplace: z.string().optional(),
  }),
});

const app = new Hono<{ Bindings: Env }>();

/**
 * Main webhook endpoint
 * POST /:id/:token/:provider
 */
app.post('/:id/:token/:provider', validateWebhookParams, async (c) => {
  const { id, token, provider } = c.req.param() as {
    id: string;
    token: string;
    provider: string;
  };

  // Construct Discord webhook URL
  const discordWebhookUrl = `https://discord.com/api/webhooks/${id}/${token}`;

  try {
    // Parse incoming payload
    const payload = await c.req.json();

    // Transform payload based on provider
    let discordPayload;

    switch (provider.toLowerCase()) {
      case 'doppler':
        const result = dopplerSchema.safeParse(payload);

        if (!result.success) {
          return error(c, 'Invalid Doppler payload', {
            status: 400,
            details: result.error.format(),
          });
        }

        discordPayload = transformDopplerPayload(result.data);
        break;

      // Future providers can be added here
      // case 'dockerhub':
      //   discordPayload = transformDockerHubPayload(payload);
      //   break;

      default:
        return error(c, `Unsupported provider: ${provider}`, {
          status: 400,
          details: { supportedProviders: ['doppler'] },
        });
    }

    // Send to Discord
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let response: Response;
    try {
      response = await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload),
        signal: controller.signal,
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return error(c, 'Discord webhook request timed out', {
          status: 504,
          code: 'DISCORD_WEBHOOK_TIMEOUT',
        });
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }

    // Handle Discord API errors
    if (!response.ok) {
      const errorText = await response.text();

      // Check environment
      const isProduction =
        c.env.DOPPLER_ENVIRONMENT === 'prd' ||
        c.env.DOPPLER_ENVIRONMENT === 'production';

      if (isProduction) {
        console.error(
          'Discord webhook error:',
          response.status,
          'Request failed'
        );
      } else {
        // Log truncated error in non-production
        const truncatedError =
          errorText.length > 1000
            ? errorText.substring(0, 1000) + '...'
            : errorText;
        console.error(
          'Discord webhook error:',
          response.status,
          truncatedError
        );
      }

      // Normalize status code to ensure it matches ContentfulStatusCode
      const statusMap: Record<number, ContentfulStatusCode> = {
        400: 400,
        401: 401,
        403: 403,
        404: 404,
        405: 405,
        429: 429,
        500: 500,
        502: 502,
        503: 503,
        504: 504,
      };

      const status = statusMap[response.status] || 502;

      return error(c, 'Failed to send webhook to Discord', {
        status,
        code: 'DISCORD_WEBHOOK_ERROR',
        details: {
          status: response.status,
          message: errorText,
        },
      });
    }

    // Success
    return success(
      c,
      {
        message: 'Webhook successfully forwarded to Discord',
        provider,
        discordStatus: response.status,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Webhook processing error:', err);

    return error(c, 'Failed to process webhook', {
      status: 500,
      code: 'WEBHOOK_PROCESSING_ERROR',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});

/**
 * GET endpoint for HTML transformer UI
 */
app.get('/', (c) => {
  return c.html(webhookTransformerPage());
});

/**
 * GET endpoint for JSON API info (for programmatic access)
 */
app.get('/api', (c) => {
  return success(c, {
    name: 'Webhook Transformer',
    description: 'Transforms webhooks from various providers to Discord format',
    usage: 'POST /webhooks/:id/:token/:provider',
    example: 'POST /webhooks/1234567890/abcdef123456/doppler',
    supportedProviders: [
      {
        name: 'doppler',
        description: 'Doppler config change webhooks',
        docs: 'https://docs.doppler.com/docs/webhooks',
      },
    ],
  });
});

export default app;
