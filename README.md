# Amina API

> Cloudflare Workers powered Image Generation & Bot API  
> Domain: `api.4mina.app` | Dashboard: `api.4mina.app/dashboard`

## Overview

A unified API service built with [Hono](https://hono.dev/) framework on Cloudflare Workers. Provides image generation, Discord bot utilities, and a developer dashboard for API key management.

## Features

- 🎨 **Image Generation** - Rank cards, welcome cards, Spotify cards, filters, overlays
- 🔑 **API Key Management** - Dashboard with Discord OAuth login
- ⚡ **Rate Limiting** - 100 requests/minute via Cloudflare KV sliding window
- 📚 **API Documentation** - OpenAPI 3.1 spec for [Bump.sh](https://bump.sh)
- 🎯 **Amina Design System** - Akame ga Kill-inspired crimson theme

## API Endpoints

### V1 Image API (Requires API Key)

**Images**

- `GET /api/v1/rank-card` - Generate rank/level cards
- `GET /api/v1/welcome-card` - Generate welcome cards
- `GET /api/v1/farewell-card` - Generate farewell cards
- `GET /api/v1/spotify-card` - Generate Spotify now-playing cards

**Filters**

- `GET /api/v1/filters/blur` - Apply blur filter
- `GET /api/v1/filters/grayscale` - Convert to grayscale
- `GET /api/v1/filters/invert` - Invert colors
- `GET /api/v1/filters/sepia` - Apply sepia tone

**Overlays**

- `GET /api/v1/overlays/gay` - Rainbow pride overlay
- `GET /api/v1/overlays/triggered` - Triggered overlay
- `GET /api/v1/overlays/wasted` - GTA wasted overlay
- `GET /api/v1/overlays/jail` - Jail bars overlay

**Generators**

- `GET /api/v1/generators/achievement` - Minecraft achievement
- `GET /api/v1/generators/alert` - Custom alert box
- `GET /api/v1/generators/quote` - Quote image
- `GET /api/v1/generators/tweet` - Fake tweet image

### Bot Statistics (Public)

- `GET /bot/stats` - Raw bot statistics (includes process uptime)
- `GET /bot/health` - Health check

### Dashboard

- `GET /dashboard` - API key management dashboard (Discord OAuth)
- `GET /dashboard/login` - Discord OAuth login
- `GET /dashboard/keys` - Manage API keys
- `GET /dashboard/docs` - API documentation

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- Cloudflare account
- MongoDB Atlas account
- Discord application (for OAuth)

### Local Development

```bash
# Install dependencies
bun install

# Run with Wrangler (simulates Cloudflare Workers)
bun run dev

# Run with Bun directly (for faster iteration)
bun run dev:local
```

### Environment Variables (Doppler)

This project uses [Doppler](https://doppler.com) for secrets management. Run with:

```bash
doppler run -- bun run dev
```

Or for local development without Doppler, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required environment variables:

| Variable              | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `MONGO_CONNECTION`    | MongoDB Atlas connection string (includes database name in path) |
| `CLIENT_ID`           | Discord OAuth2 application client ID                             |
| `CLIENT_SECRET`       | Discord OAuth2 application client secret                         |
| `DOPPLER_ENVIRONMENT` | Environment name: `dev` or `prd`                                 |

> **Note:** `SESSION_SECRET` is optional - it falls back to `CLIENT_SECRET` if not set.

## Setup Guide

### 1. Cloudflare KV Namespace

Create a KV namespace for rate limiting:

```bash
# Create the namespace
wrangler kv:namespace create RATE_LIMIT

# Note the ID and update wrangler.toml:
# [[kv_namespaces]]
# binding = "RATE_LIMIT"
# id = "your-namespace-id"
```

### 2. MongoDB Atlas Connection

Cloudflare Workers now support the native MongoDB driver (since April 2025).

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster > **Connect** > **Drivers**
3. Select **Node.js** driver
4. Copy the connection string (include database name in path)
5. Replace `<password>` with your database user password

```bash
# Using Doppler (recommended)
doppler secrets set MONGO_CONNECTION

# Or directly with Wrangler
wrangler secret put MONGO_CONNECTION
# Paste: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/amina?retryWrites=true&w=majority
```

> **Note:** MongoDB Atlas Data API has been deprecated (EOL: September 30, 2025).
> We use the native MongoDB driver which requires `nodejs_compat` flag in wrangler.toml.

### 3. Discord OAuth Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create or select your application
3. Go to **OAuth2** settings
4. Add redirect URI: `https://api.4mina.app/dashboard/auth/callback`
5. Note your **Client ID** and **Client Secret**

```bash
# Using Doppler (recommended)
doppler secrets set CLIENT_ID CLIENT_SECRET

# Or directly with Wrangler
wrangler secret put CLIENT_ID
wrangler secret put CLIENT_SECRET
```

### 4. Deploy to Cloudflare

```bash
# Deploy to production (with Doppler)
bun run deploy:prod

# Or use GitHub Actions (automatic on push to main)
```

### 5. API Documentation (Bump.sh)

```bash
# Deploy OpenAPI spec to Bump.sh
bunx bump deploy docs/openapi.yaml --doc amina-api --token YOUR_BUMP_TOKEN
```

## Architecture

```
src/
├── index.ts              # Main Hono app entry point
├── server.ts             # Local dev server (Bun)
├── types.ts              # TypeScript type definitions
├── middleware/
│   ├── index.ts          # CORS, logging middleware
│   └── auth.ts           # API key & dashboard auth
├── lib/
│   ├── mongodb.ts        # MongoDB Atlas Data API client
│   ├── api-keys.ts       # API key generation/validation
│   ├── rate-limit.ts     # Sliding window rate limiter
│   ├── discord-oauth.ts  # Discord OAuth2 utilities
│   ├── response.ts       # API response helpers
│   ├── uptime.ts         # Uptime Kuma integration
│   ├── bot-stats.ts      # Bot statistics
│   └── cards/
│       ├── rank-card.ts    # Rank card SVG generator
│       ├── welcome-card.ts # Welcome/farewell cards
│       └── spotify-card.ts # Spotify now-playing cards
├── dashboard/
│   ├── index.ts          # Dashboard routes
│   └── templates.ts      # HTML templates
└── routes/
    ├── bot.ts            # Bot statistics endpoints
    ├── guild.ts          # Guild management
    ├── images.ts         # Legacy image routes
    └── v1/
        ├── index.ts      # V1 router
        ├── images.ts     # Image generation
        ├── filters.ts    # Image filters
        ├── overlays.ts   # Image overlays
        └── generators.ts # Content generators
```

## Using the API

### Authentication

Include your API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer amina_live_xxxx..." \
  "https://api.4mina.app/api/v1/rank-card?username=John&level=5&xp=1234&maxXp=2000"
```

### Example: Generate Rank Card

```bash
curl -o rank.svg \
  -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.4mina.app/api/v1/rank-card?username=Player&discriminator=1234&level=10&xp=500&maxXp=1000&rank=5"
```

### Rate Limits

- **Standard**: 100 requests per minute
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## License

MIT - Part of the Amina project
