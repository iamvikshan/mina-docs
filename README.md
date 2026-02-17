# mina-docs

Documentation portal for [Amina](https://4mina.app) — API reference, developer wiki, and user guides.

## Structure

```
apis/          → OpenAPI specifications
pages/         → Documentation pages (MDX/Markdown)
  wiki/        → Developer wiki (28 pages)
public/        → Static assets (favicon, logo, social images)
scripts/       → Build scripts (Bun SSR patch)
```

## Development

```bash
bun install
bun run dev        # Start Zudoku dev server at localhost:9000
bun run build      # Build for production (prerendered static site)
```

## Deployment

Cloudflare Pages via dashboard → [docs.4mina.app](https://docs.4mina.app)

- Build command: `bun install && bun run build`
- Output directory: `dist`

## Links

- [Documentation Portal](https://docs.4mina.app) — API docs, wiki & user guides
- [Dashboard](https://4mina.app/dash) — Bot management
- [Discord](https://discord.gg/uMgS9evnmv) — Community & support
- [GitHub](https://github.com/iamvikshan/amina) — Bot source code
