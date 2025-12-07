# Amina API

> Image generation and bot utilities API powered by Cloudflare Workers

[![API](https://img.shields.io/badge/API-api.4mina.app-dc143c)](https://api.4mina.app)
[![Dashboard](https://img.shields.io/badge/Dashboard-4mina.app%2Fdash-dc143c)](https://4mina.app/dash)
[![Documentation](https://img.shields.io/badge/Docs-docs.4mina.app-dc143c)](https://docs.4mina.app)

## Overview

Production API service built with [Hono](https://hono.dev/) on Cloudflare Workers. Provides image generation endpoints, Discord bot registry, and webhook transformation utilities.

> [!IMPORTANT]
> Complete API documentation, authentication guides, and interactive examples are available at [docs.4mina.app](https://docs.4mina.app). This README covers development setup only.

## Key Features

- **Image Generation** - SVG-based cards, filters, overlays, and meme generators
- **Bot Registry** - Public bot discovery with stats and commands
- **Webhook Transformations** - Convert provider webhooks to Discord format
- **Rate Limiting** - 60 requests/minute per API key via sliding window algorithm
- **OpenAPI 3.1** - Full specification at `docs/v1-api.yml`

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.3.3
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) >= 4.33.0
- Cloudflare account with Workers enabled
- MongoDB Atlas cluster

### Development

```bash
# Install dependencies
bun install

# Run with Wrangler (Cloudflare Workers environment)
bun run dev

# Run with Bun (faster iteration, no Workers features)
bun run dev:local
```

> [!TIP]
> Use `bun run dev:local` for rapid development of business logic. Switch to `bun run dev` when testing Workers-specific features (KV, secrets, etc.).

### Environment Configuration

**Development without Doppler:**

```bash
cp .env.example .env
# Edit .env with your credentials
bun run dev:local
```

**Required Secrets:**

| Variable           | Description                     | Example                                             |
| ------------------ | ------------------------------- | --------------------------------------------------- |
| `MONGO_CONNECTION` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/amina` |

**Optional Secrets:**

| Variable        | Description                         |
| --------------- | ----------------------------------- |
| `CLIENT_SECRET` | Salt for IP hashing in rate limiter |
| `LOGS_WEBHOOK`  | Discord webhook for error logs      |

## Deployment

### Cloudflare Workers Setup

**1. Create KV Namespaces**

```bash
# Rate limiting store
wrangler kv:namespace create RATE_LIMIT

# Bot registry store
wrangler kv:namespace create BOTS

# Update wrangler.jsonc with the namespace IDs
```

**2. Configure Secrets**

```bash
wrangler secret put MONGO_CONNECTION
```

**3. Deploy**

```bash
# Deploy to production
bun run deploy:prod

# Deploy to staging
bun run deploy:staging
```

> [!WARNING]
> Always test deployments in staging before pushing to production. Rate limiting and bot registry require KV namespaces to be properly bound in `wrangler.jsonc`.

<details>
<summary><strong>Project Structure</strong></summary>

## Project Structure

```
.
├── docs/
│   └── v1-api.yml              # OpenAPI 3.1 specification
├── scripts/
│   └── iamvikshan.sh           # Deployment utilities
├── src/
│   ├── index.ts                # Hono app entry point
│   ├── server.ts               # Local dev server (Bun)
│   ├── lib/
│   │   ├── api-keys.ts         # API key validation
│   │   ├── bot-stats.ts        # Bot statistics aggregation
│   │   ├── botAuth.ts          # Bot authentication
│   │   ├── kvBots.ts           # Bot registry KV operations
│   │   ├── logger.ts           # Structured logging
│   │   ├── mongodb.ts          # MongoDB client
│   │   ├── rate-limit.ts       # Sliding window rate limiter
│   │   ├── response.ts         # Standardized API responses
│   │   ├── styles.ts           # Design system utilities
│   │   ├── cards/
│   │   │   ├── index.ts
│   │   │   ├── rank-card.ts    # SVG rank card generator
│   │   │   ├── spotify-card.ts # Spotify now-playing card
│   │   │   └── welcome-card.ts # Welcome/farewell cards
│   │   └── webhooks/
│   │       ├── doppler.ts      # Doppler webhook transformer
│   │       └── templates.ts    # HTML templates
│   ├── middleware/
│   │   ├── index.ts            # CORS, logging, error handling
│   │   ├── auth.ts             # API key authentication
│   │   ├── botAuth.ts          # Bot secret authentication
│   │   ├── rateLimit.ts        # Rate limiting middleware
│   │   └── webhooks.ts         # Webhook validation
│   └── routes/
│       ├── bot.ts              # Bot health & stats endpoints
│       ├── guild.ts            # Guild management
│       ├── images.ts           # Legacy image routes
│       ├── webhooks.ts         # Webhook transformation
│       ├── internal/
│       │   ├── index.ts
│       │   ├── bots.ts         # Bot registration & heartbeat
│       │   └── guilds.ts       # Guild data sync
│       └── v1/
│           ├── index.ts        # V1 API router
│           ├── bots.ts         # Public bot discovery
│           ├── images.ts       # Image generation
│           ├── filters.ts      # Image filters
│           ├── generators.ts   # Meme generators
│           └── overlays.ts     # Image overlays
├── types/
│   ├── api.d.ts                # API types
│   ├── bot.d.ts                # Bot types
│   ├── cards.d.ts              # Card generation types
│   ├── database.d.ts           # Database schema
│   ├── discord.d.ts            # Discord types
│   ├── env.d.ts                # Environment bindings
│   └── index.d.ts              # Type exports
├── package.json
├── tsconfig.json
└── wrangler.jsonc              # Cloudflare Workers config
```

</details>

## Development Guidelines

### API Response Format

All JSON responses follow a standardized structure:

```typescript
// Success
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "meta": {
    "generatedAt": "2024-01-01T00:00:00.000Z"
  }
}

// Error
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE"
  },
  "meta": {
    "generatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Rate Limiting

Rate limits are enforced using a sliding window algorithm stored in Cloudflare KV:

- **Authenticated endpoints**: 60 requests/minute per API key
- **Public endpoints**: 60 requests/minute per IP address (hashed)

Headers returned:

- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets

### Authentication

**API Key (V1 endpoints)**:

```bash
Authorization: Bearer amina_xxxxxxxxxx
```

**Bot Secret (Internal endpoints)**:

```bash
X-Bot-Secret: your-bot-secret
X-Bot-ID: your-bot-id
```

> [!TIP]
> API keys are validated against MongoDB. Bot secrets are validated through Discord's OAuth2 flow using your bot's client secret. You must own the bot to modify its data.

## Testing

```bash
# Type checking
bun run check

# Build (validates TypeScript and Wrangler config)
bun run build
```

> [!NOTE]
> There are currently no unit tests. API functionality is validated through integration testing against the staging environment.

## Contributing

Contributions are welcome. Please ensure:

1. Code follows existing patterns and conventions
2. TypeScript types are properly defined
3. API responses follow the standardized format
4. Changes are tested in staging before production deployment

---

**Support**: [Discord Server](https://discord.gg/uMgS9evnmv)
