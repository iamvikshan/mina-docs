# mina-dev

> Amina API & Developer Portal

This repository contains:

- **API Server** — Cloudflare Workers-powered API for [api.4mina.app](https://api.4mina.app), built with [Hono](https://hono.dev)
- **Developer Portal** — API documentation and developer wiki powered by [Zudoku](https://zudoku.dev), deployed to [dev.4mina.app](https://dev.4mina.app) via Cloudflare Pages

## Project Structure

```
 src/              # API server source (Cloudflare Workers)
 types/            # TypeScript type definitions
 docs/             # Developer portal (Zudoku)
   ├── apis/         # OpenAPI specifications
   ├── pages/        # Markdown/MDX documentation pages
   │   ├── wiki/     # Developer wiki (migrated from GitHub wiki)
   │   └── ...       # Other documentation pages
   └── zudoku.config.ts
 wrangler.jsonc    # Workers config (amina-api)
 package.json
```

## Development

### API Server

```bash
# Install dependencies
bun install

# Local development
bun run dev

# Deploy to Cloudflare Workers
bun run deploy
```

### Developer Portal

```bash
cd docs
npm install
npm run dev      # Local dev server
npm run build    # Production build → docs/dist/
```

## Deployment

- **API Server**: Deployed to Cloudflare Workers as `amina-api` via `wrangler deploy`
- **Developer Portal**: Deployed to Cloudflare Pages as `mina-dev` via CF dashboard
  - Build command: `cd docs && npm run build`
  - Output directory: `docs/dist`
  - Custom domain: `dev.4mina.app`

## Links

- [API](https://api.4mina.app) • [Developer Portal](https://dev.4mina.app) • [Discord](https://discord.gg/uMgS9evnmv) • [Dashboard](https://4mina.app/dash)
