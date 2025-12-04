/**
 * V1 API Routes
 *
 * All authenticated API endpoints under /v1
 */

import { Hono } from 'hono';
import type { Env } from '../../types';
import { success } from '../../lib/response';

// Import route modules
import images from './images';
import filters from './filters';
import overlays from './overlays';
import generators from './generators';

const v1 = new Hono<{ Bindings: Env }>();

// API info endpoint (no auth required)
v1.get('/', (c) => {
  return success(c, {
    version: 'v1',
    documentation: 'https://docs.4mina.app/api',
    endpoints: {
      images: {
        'rank-card': 'GET /v1/images/rank-card',
        'welcome-card': 'GET /v1/images/welcome-card',
        'farewell-card': 'GET /v1/images/farewell-card',
        'spotify-card': 'GET /v1/images/spotify-card',
        color: 'GET /v1/images/color',
        circle: 'GET /v1/images/circle',
      },
      filters: {
        greyscale: 'GET /v1/images/filters/greyscale',
        blur: 'GET /v1/images/filters/blur',
        sepia: 'GET /v1/images/filters/sepia',
        invert: 'GET /v1/images/filters/invert',
        brighten: 'GET /v1/images/filters/brighten',
        darken: 'GET /v1/images/filters/darken',
        contrast: 'GET /v1/images/filters/contrast',
        saturate: 'GET /v1/images/filters/saturate',
        'hue-rotate': 'GET /v1/images/filters/hue-rotate',
        pixelate: 'GET /v1/images/filters/pixelate',
      },
      overlays: {
        approved: 'GET /v1/images/overlays/approved',
        rejected: 'GET /v1/images/overlays/rejected',
        wasted: 'GET /v1/images/overlays/wasted',
        triggered: 'GET /v1/images/overlays/triggered',
        gay: 'GET /v1/images/overlays/gay',
        jail: 'GET /v1/images/overlays/jail',
        rip: 'GET /v1/images/overlays/rip',
      },
      generators: {
        affect: 'GET /v1/images/generators/affect',
        beautiful: 'GET /v1/images/generators/beautiful',
        changemymind: 'GET /v1/images/generators/changemymind',
        delete: 'GET /v1/images/generators/delete',
        trash: 'GET /v1/images/generators/trash',
        drake: 'GET /v1/images/generators/drake',
        distracted: 'GET /v1/images/generators/distracted',
        facts: 'GET /v1/images/generators/facts',
      },
    },
    authentication: {
      type: 'Bearer',
      header: 'Authorization: Bearer <api_key>',
      getKey: 'https://api.4mina.app/dashboard',
    },
    rateLimit: {
      requests: 60,
      window: '1 minute',
      headers: [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
      ],
    },
  });
});

// Mount route modules
v1.route('/images', images);
v1.route('/images/filters', filters);
v1.route('/images/overlays', overlays);
v1.route('/images/generators', generators);

export default v1;
