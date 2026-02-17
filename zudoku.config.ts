import type { ZudokuConfig } from 'zudoku';

const config: ZudokuConfig = {
  site: {
    title: 'Amina Dev Portal',
    logo: {
      src: {
        light: '/logo.png',
        dark: '/logo.png',
      },
      alt: 'Amina',
      width: 120,
    },
    showPoweredBy: false,
    footer: {
      columns: [
        {
          title: 'Resources',
          links: [
            { label: 'Consumer Docs', href: '/guide/index' },
            { label: 'Dashboard', href: 'https://4mina.app/dash' },
          ],
        },
        {
          title: 'Community',
          links: [
            { label: 'Discord', href: 'https://discord.gg/uMgS9evnmv' },
            {
              label: 'GitHub',
              href: 'https://github.com/iamvikshan/mina-docs',
            },
          ],
        },
      ],
      social: [
        { icon: 'github', href: 'https://github.com/iamvikshan/mina-docs' },
        { icon: 'discord', href: 'https://discord.gg/uMgS9evnmv' },
      ],
    },
  },
  metadata: {
    title: 'Amina Dev Portal',
    description:
      "api docs and developer wiki for amina. your server's guardian, mod tool, and vibe keeper.",
    favicon: '/favicon.ico',
  },
  theme: {
    customCss: {
      ':root': {
        '--amina-crimson': '#dc143c',
        '--blood-red': '#8b0000',
        '--rose-red': '#e63946',
        '--midnight-black': '#0a0a0a',
        '--shadow-gray': '#1a1a1a',
        '--steel-gray': '#2d2d2d',
        '--imperial-gold': '#ffd700',
        '--electric-blue': '#1e90ff',
        '--glow-crimson': '0 0 20px rgba(220, 20, 60, 0.6)',
      },
      'h1, h2, h3, h4, h5, h6': {
        'font-weight': '700',
      },
      'h1, h2': {
        'text-transform': 'uppercase',
        'letter-spacing': '0.05em',
      },
    },
    fonts: {
      sans: {
        url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap',
        fontFamily: 'Inter, sans-serif',
      },
      mono: {
        url: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap',
        fontFamily: 'Fira Code, monospace',
      },
    },
    light: {
      primary: '#dc143c',
      primaryForeground: '#ffffff',
      secondary: '#8b0000',
      secondaryForeground: '#ffffff',
    },
    dark: {
      primary: '#e63946',
      primaryForeground: '#ffffff',
      secondary: '#dc143c',
      secondaryForeground: '#ffffff',
      background: '#0a0a0a',
    },
  },
  navigation: [
    {
      type: 'category',
      label: 'Guide',
      icon: 'book',
      items: [
        { type: 'doc', label: 'Home', file: 'guide/index' },
        {
          type: 'category',
          label: 'Getting Started',
          items: [
            { type: 'doc', label: 'Introduction', file: 'guide/intro' },
            { type: 'doc', label: 'Getting Started', file: 'guide/start' },
          ],
        },
        { type: 'doc', label: 'Commands', file: 'guide/commands' },
        {
          type: 'category',
          label: 'Command Categories',
          items: [
            { type: 'doc', label: 'Mina AI', file: 'guide/mina-ai' },
            { type: 'doc', label: 'Bot', file: 'guide/bot' },
            { type: 'doc', label: 'Admin & Setup', file: 'guide/admin' },
            { type: 'doc', label: 'Moderation', file: 'guide/moderation' },
            { type: 'doc', label: 'Music', file: 'guide/music' },
            { type: 'doc', label: 'Economy', file: 'guide/economy' },
            { type: 'doc', label: 'Fun', file: 'guide/fun' },
            { type: 'doc', label: 'Giveaways', file: 'guide/giveaways' },
            { type: 'doc', label: 'Social', file: 'guide/social' },
            { type: 'doc', label: 'Stats', file: 'guide/stats' },
            { type: 'doc', label: 'Info', file: 'guide/info' },
            { type: 'doc', label: 'Utility', file: 'guide/utility' },
            { type: 'doc', label: 'Dev', file: 'guide/dev' },
          ],
        },
        { type: 'doc', label: 'Self-Hosting', file: 'guide/selfhost' },
        { type: 'doc', label: 'Helping Out', file: 'guide/helping-out' },
      ],
    },
    {
      type: 'category',
      label: 'Documentation',
      icon: 'book-open',
      items: [{ type: 'doc', file: 'introduction' }],
    },
    {
      type: 'category',
      label: 'Wiki',
      icon: 'library',
      items: [
        { type: 'doc', label: 'Welcome', file: 'wiki/home' },
        {
          type: 'category',
          label: 'Getting Started',
          items: [
            {
              type: 'doc',
              label: 'Quick Start',
              file: 'wiki/quick-start-self-hosting',
            },
            { type: 'doc', label: 'Configuration', file: 'wiki/configuration' },
          ],
        },
        {
          type: 'category',
          label: 'Mina AI',
          items: [
            {
              type: 'doc',
              label: 'The Responder',
              file: 'wiki/mina-ai-the-responder',
            },
            {
              type: 'doc',
              label: 'Configuration',
              file: 'wiki/mina-ai-configuration',
            },
            {
              type: 'doc',
              label: 'Memory System',
              file: 'wiki/mina-ai-memory-system',
            },
          ],
        },
        {
          type: 'category',
          label: 'Architecture',
          items: [
            {
              type: 'doc',
              label: 'Overview',
              file: 'wiki/system-architecture-overview',
            },
            {
              type: 'doc',
              label: 'Commands & Events',
              file: 'wiki/command-and-event-handling',
            },
            {
              type: 'doc',
              label: 'UI Handlers',
              file: 'wiki/ui-interaction-handlers',
            },
            {
              type: 'doc',
              label: 'Database Schema',
              file: 'wiki/database-schema',
            },
            {
              type: 'doc',
              label: 'API Integrations',
              file: 'wiki/external-api-integrations',
            },
          ],
        },
        {
          type: 'category',
          label: 'Deployment',
          items: [
            {
              type: 'doc',
              label: 'Production Deploy',
              file: 'wiki/deployment-to-production',
            },
            {
              type: 'doc',
              label: 'Release Process',
              file: 'wiki/release-process',
            },
          ],
        },
        {
          type: 'category',
          label: 'Development',
          items: [
            {
              type: 'doc',
              label: 'Creating Commands',
              file: 'wiki/extending-the-bot-creating-commands',
            },
            {
              type: 'doc',
              label: 'Developer Commands',
              file: 'wiki/developer-commands',
            },
          ],
        },
        {
          type: 'category',
          label: 'Administration',
          items: [
            { type: 'doc', label: 'Tickets', file: 'wiki/ticket-system' },
            {
              type: 'doc',
              label: 'Reaction Roles',
              file: 'wiki/reaction-roles',
            },
            { type: 'doc', label: 'Greetings', file: 'wiki/greeting-system' },
            { type: 'doc', label: 'Logging', file: 'wiki/logging-system' },
            {
              type: 'doc',
              label: 'Suggestions',
              file: 'wiki/suggestion-system',
            },
          ],
        },
        {
          type: 'category',
          label: 'Moderation',
          items: [
            {
              type: 'doc',
              label: 'Moderation Suite',
              file: 'wiki/moderation-suite',
            },
            { type: 'doc', label: 'AutoMod', file: 'wiki/automod-system' },
          ],
        },
        {
          type: 'category',
          label: 'Entertainment',
          items: [
            { type: 'doc', label: 'Music', file: 'wiki/music-system' },
            { type: 'doc', label: 'Economy', file: 'wiki/economy-system' },
            { type: 'doc', label: 'Giveaways', file: 'wiki/giveaway-system' },
            { type: 'doc', label: 'Invites', file: 'wiki/invite-tracking' },
          ],
        },
        {
          type: 'category',
          label: 'Utility',
          items: [
            {
              type: 'doc',
              label: 'Stats & Leveling',
              file: 'wiki/statistics-and-leveling-system',
            },
            { type: 'doc', label: 'Profiles', file: 'wiki/user-profiles' },
          ],
        },
      ],
    },
    {
      type: 'link',
      label: 'API Reference',
      to: '/api',
      icon: 'code',
    },
  ],
  redirects: [{ from: '/', to: '/guide/index' }],
  apis: {
    type: 'file',
    input: './apis/v1-api.yml',
    path: '/api',
  },
  docs: {
    files: '/pages/**/*.{md,mdx}',
  },
};

export default config;
