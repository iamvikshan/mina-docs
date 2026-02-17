# mina-dev

API server and developer portal for [Amina](https://4mina.app) — your server's guardian, mod tool, and vibe keeper.

## Structure

```
src/           → Cloudflare Worker API server (Hono + MongoDB)
docs/          → Developer portal (Zudoku on CF Pages)
  apis/        → OpenAPI specifications
  pages/       → Documentation pages (MDX/Markdown)
    wiki/      → Migrated GitHub wiki (28 pages)
types/         → Shared TypeScript type definitions
```

## Development

### API Server

```bash
bun install
bun run dev        # Start Wrangler dev server
```

### Documentation Portal

```bash
cd docs
bun install
bun run dev        # Start Zudoku dev server at localhost:3000
bun run build      # Build for production
```

## Deployment

- **API**: Cloudflare Workers via Wrangler (`amina-api`)
- **Docs**: Cloudflare Pages via dashboard (`mina-dev` → [dev.4mina.app](https://dev.4mina.app))
  - Build command: `cd docs && bun install && bun run build`
  - Output directory: `docs/dist`

## Links

- [Developer Portal](https://dev.4mina.app) — API docs & wiki
- [Consumer Docs](https://docs.4mina.app) — User documentation
- [Dashboard](https://4mina.app/dash) — API keys & bot management
- [Discord](https://discord.gg/uMgS9evnmv) — Community & support
