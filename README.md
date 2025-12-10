# Amina Documentation

Official documentation site for Amina, a creative and energetic Discord bot designed to bring fun, functionality, and community engagement to Discord servers.

> [!IMPORTANT]
> Looking for the **API Documentation**? Visit [docs.api.4mina.app](https://docs.api.4mina.app)

## About

This repository contains the comprehensive documentation for [Amina](https://github.com/iamvikshan/amina), covering everything from getting started guides to advanced self-hosting instructions. The documentation is built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), providing a fast, accessible, and user-friendly experience.

## What is Amina?

Amina is a multifaceted Discord bot offering:

- **Moderation Tools** - Advanced server management, warning systems, and automated moderation
- **Music Playback** - High-quality music streaming with Lavalink integration
- **Fun Commands** - Anime-themed interactions, games, and entertainment features
- **Utility Features** - Server statistics, user profiles, leveling system, and more
- **Custom Configuration** - Web-based dashboard for easy server customization

Visit [4mina.app](https://4mina.app) to access the dashboard and [invite Amina](https://discord.com/oauth2/authorize?client_id=1035629678632915055) to your server.

## Documentation Structure

- **Getting Started** - Quick setup and introduction to Amina
- **Commands** - Comprehensive command reference organized by category
  - Admin & Moderation
  - Fun Commands
  - Utility Commands
- **Self-Hosting** - Detailed guides for running your own instance
  - Local Installation
  - Docker Deployment
  - Heroku Setup
  - Replit Installation
- **Dashboard** - Configuration guides for the web interface
- **Contributing** - How to help improve Amina

## Tech Stack

This documentation site is built with modern web technologies:

- **Framework**: [Astro 5.x](https://astro.build) - Static site generator
- **UI**: [Starlight](https://starlight.astro.build) - Documentation theme
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) - Utility-first CSS framework
- **Icons**: [Astro Icon](https://github.com/natemoo-re/astro-icon) with Iconify collections
- **Package Manager**: [Bun](https://bun.sh) - Fast JavaScript runtime and package manager

### Key Features

- Built-in search functionality
- Dark/light mode support
- Responsive design
- Optimized image handling with AVIF format
- Multi-format compression (gzip, brotli, zstd)
- Custom HTML minification
- TypeScript support

## Development

### Prerequisites

- [Bun](https://bun.sh) v1.3.0 or higher
- Node.js environment (for compatibility)

### Setup

```bash
# Clone the repository
git clone https://github.com/iamvikshan/amina-docs.git
cd amina-docs

# Install dependencies
bun install

# Start development server
bun dev
```

The development server will start at `http://localhost:4321`.

### Available Scripts

```bash
# Development
bun dev          # Start development server
bun start        # Alias for dev

# Production
bun run build    # Build for production with HTML minification
bun preview      # Preview production build

# Quality Assurance
bun check        # Run Astro type checking
bun f            # Format code with Prettier
```

### Project Configuration

Key configuration files:

- `astro.config.mjs` - Astro and integration settings
- `tailwind.config.mts` - Tailwind CSS configuration (v4 compatible)
- `postcss.config.mjs` - PostCSS with @tailwindcss/postcss plugin
- `tsconfig.json` - TypeScript compiler options
- `process-html.mjs` - Custom HTML minification script

## Building for Production

The production build process includes:

1. Astro static site generation
2. Image optimization (Sharp + AVIF)
3. CSS minification (lightningcss)
4. JavaScript minification (esbuild)
5. HTML minification (html-minifier-terser)
6. Multi-format compression (astro-compressor)

```bash
# Build the site
bun run build

# Output directory: ./dist
```

The build achieves approximately 6.9% HTML size reduction and creates compressed versions (.gz, .br, .zst) of all assets.

## Contributing

We welcome contributions to improve the documentation:

1. Fork the repository
2. Create a feature branch (`git checkout -b docs/improve-section`)
3. Make your changes
4. Run quality checks (`bun check && bun f`)
5. Commit your changes (`git commit -m 'docs: improve getting started guide'`)
6. Push to your fork (`git push origin docs/improve-section`)
7. Open a Pull Request

### Documentation Guidelines

- Use clear, concise language
- Include code examples where appropriate
- Test all command examples
- Ensure proper Markdown formatting
- Add alt text to images
- Maintain consistent tone and style

## Links

- **Bot Repository**: [github.com/iamvikshan/amina](https://github.com/iamvikshan/amina)
- **Documentation Site**: [docs.4mina.app](https://docs.4mina.app)
- **Dashboard**: [4mina.app](https://4mina.app)
- **Discord Server**: [discord.gg/uMgS9evnmv](https://discord.gg/uMgS9evnmv)
- **Support**: [ko-fi.com/vikshan](https://ko-fi.com/vikshan)

## License

This documentation is part of the Amina project. Please refer to the [main repository](https://github.com/iamvikshan/amina) for licensing information.

## Acknowledgments

- Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build)
- Icons from [Iconify](https://iconify.design)
- Special thanks to the Amina community and contributors

---

**Note**: This documentation is actively maintained. If you find any issues or outdated information, please [open an issue](https://github.com/iamvikshan/amina-docs/issues) or join our [Discord server](https://discord.gg/uMgS9evnmv) for assistance.

# Set these in your shell profile (.bashrc, .zshrc, or .fish config)

export CLAUDE_CODE_USE_VERTEX=1
export ANTHROPIC_VERTEX_PROJECT_ID=YOUR-PROJECT-ID
export CLOUD_ML_REGION=global
