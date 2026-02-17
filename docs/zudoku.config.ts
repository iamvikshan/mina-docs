import type { ZudokuConfig } from 'zudoku';

const config: ZudokuConfig = {
  site: {
    title: 'Amina Dev Portal',
    logo: {
      src: {
        light: 'https://4mina.app/logo.png',
        dark: 'https://4mina.app/logo.png',
      },
      alt: 'Amina',
      width: 120,
    },
    showPoweredBy: false,
  },
  metadata: {
    title: 'Amina Dev Portal',
    description:
      "api docs and developer wiki for amina. your server's guardian, mod tool, and vibe keeper.",
    favicon: 'https://4mina.app/favicon.ico',
  },
  theme: {
    light: {
      primary: '#6366f1',
      primaryForeground: '#ffffff',
    },
    dark: {
      primary: '#818cf8',
      primaryForeground: '#ffffff',
    },
  },
  navigation: [
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
  redirects: [{ from: '/', to: '/introduction' }],
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
