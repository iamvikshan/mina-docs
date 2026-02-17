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
      items: [
        {
          type: 'doc',
          file: 'introduction',
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
