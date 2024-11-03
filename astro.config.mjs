import { defineConfig } from 'astro/config';
import starlightSiteGraph from 'starlight-site-graph';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';
import starlight from '@astrojs/starlight';
import node from '@astrojs/node';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@astrojs/react';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper function to ensure proper URL format
const getSiteURL = (val) => {
  const isProduction = import.meta.env.PROD === true;
  if (isProduction) {
    if (val && val !== '/') {
      return val.startsWith('http') ? val : `https://${val}`;
    }
  }
  return 'http://localhost:8080';
};

export default defineConfig({
  site: getSiteURL(process.env.BASE_URL),
  image: { domains: ['images.unsplash.com'] },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    react(),
    tailwind(),
    sitemap(),
    starlight({
      title: 'Amina Docs',
      sidebar: [
        {
          label: 'Quick Start Guides',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Commands',
          collapsed: true,
          items: [
            { label: 'My Commands', link: 'commands/commands' },
            {
              label: 'Admin & Mod',
              autogenerate: { directory: 'commands/admin' },
            },
            { label: 'Fun', autogenerate: { directory: 'commands/fun' } },
            {
              label: 'Utility',
              autogenerate: { directory: 'commands/utility' },
            },
            { label: 'Developer', link: 'commands/dev/dev' },
          ],
        },
        {
          label: 'Self Hosting',
          items: [
            { label: 'Introduction', link: 'selfhost/start' },
            {
              label: 'Installation',
              autogenerate: { directory: 'selfhost/installation' },
            },
            {
              label: 'Dashboard',
              autogenerate: { directory: 'selfhost/dashboard' },
            },
          ],
        },
        {
          label: 'Extras',
          autogenerate: { directory: 'extras' },
        },
      ],

      social: {
        github: 'https://github.com/vixshan/amina',
        discord:
          'https://discord.com/oauth2/authorize?client_id=1035629678632915055',
      },
      disable404Route: true,
      customCss: ['./src/assets/styles/starlight.css'],
      favicon: '/favicon.ico',
      components: {
        SiteTitle: './src/components/ui/starlight/SiteTitle.astro',
        Head: './src/components/ui/starlight/Head.astro',
        MobileMenuFooter:
          './src/components/ui/starlight/MobileMenuFooter.astro',
        ThemeSelect: './src/components/ui/starlight/ThemeSelect.astro',
      },
      head: [
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://amina.vikshan.tech' + '/social.webp',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'twitter:image',
            content: 'https://amina.vikshan.tech' + '/social.webp',
          },
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/vixshan/amina/edit/main/astro/',
      },
      expressiveCode: {
        styleOverrides: { borderRadius: '0.5rem' },
      },
      lastUpdated: true,
      plugins: [
        starlightSiteGraph({}),
      ],
    }),
    compressor({ gzip: true, brotli: true }),
  ],
  vite: {
    build: {
      cssMinify: true,
      minify: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@content': path.resolve(__dirname, './src/content'),
        '@data': path.resolve(__dirname, './src/data_files'),
        '@images': path.resolve(__dirname, './src/images'),
        '@scripts': path.resolve(__dirname, './src/assets/scripts'),
        '@styles': path.resolve(__dirname, './src/assets/styles'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@root': path.resolve(__dirname, '..'),
        '@docs': path.resolve(__dirname, './src/content/docs'),
      },
    },
  },
});
