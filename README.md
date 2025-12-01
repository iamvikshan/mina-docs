# Amina API

> Cloudflare Workers powered API for the Amina Discord Bot  
> Domain: `api.4mina.app`

## Overview

This is a unified API service built with [Hono](https://hono.dev/) framework, designed to run on Cloudflare Workers. It provides various endpoints for the Amina Discord bot ecosystem.

## Endpoints

### Bot Statistics

- `GET /bot/metrics` - Combined bot stats and uptime metrics
- `GET /bot/status` - Uptime monitor status
- `GET /bot/stats` - Raw bot statistics
- `GET /bot/health` - Health check

### Guild Management

- `GET /guild/:id` - Get guild settings
- `PATCH /guild/:id` - Update guild settings
- `POST /guild/:id/refresh` - Refresh guild data

### Image Generation

- `GET /images/rank-card` - Generate rank cards
- `GET /images/welcome` - Generate welcome images
- `GET /images/leaderboard` - Generate leaderboard images

## Development

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Local Development

```bash
# Install dependencies
bun install

# Run with Wrangler (simulates Cloudflare Workers)
bun run dev

# Run with Bun directly (for faster iteration)
bun run dev:local
```

### Environment Variables

For local development, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

For production (Cloudflare), set secrets via dashboard or CLI:

```bash
wrangler secret put BOT_API_URL
wrangler secret put UPTIME_KUMA_URL
```

### Deployment

```bash
# Deploy to Cloudflare Workers
bun run deploy

# Deploy to production
bun run deploy:prod
```

## Configuration

### Custom Domain Setup

1. Go to Cloudflare Dashboard > Workers & Pages
2. Select your worker
3. Go to Settings > Domains & Routes
4. Add custom domain: `api.4mina.app`

### KV Namespace (Optional caching)

```bash
# Create KV namespace
wrangler kv:namespace create CACHE

# Add the binding to wrangler.toml
```

## Architecture

```
src/
├── index.ts          # Main Hono app entry point
├── types.ts          # TypeScript type definitions
├── middleware/       # Global middleware (CORS, logging, etc.)
├── lib/              # Shared utilities and helpers
│   ├── response.ts   # API response helpers
│   ├── uptime.ts     # Uptime Kuma integration
│   └── bot-stats.ts  # Bot statistics fetching
└── routes/           # Route handlers
    ├── bot.ts        # Bot-related endpoints
    ├── guild.ts      # Guild management endpoints
    └── images.ts     # Image generation endpoints
```

## Future Endpoints

- `/auth/*` - Discord OAuth flow
- `/webhook/*` - Bot event webhooks
- `/analytics/*` - Usage analytics
- `/cdn/*` - Asset/image CDN

## License

MIT - Part of the Amina project
