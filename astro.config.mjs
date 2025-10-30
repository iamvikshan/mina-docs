import { defineConfig } from 'astro/config';
import starlightSiteGraph from 'starlight-site-graph';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';
import starlight from '@astrojs/starlight';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@astrojs/react';
import icon from 'astro-icon';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://docs.vikshan.me',
  image: { domains: ['images.unsplash.com'] },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    icon({
      include: {
        solar: ['emoji-funny-circle-broken'],
        'fluent-color': ['*'],
        'flat-color-icons': ['*'],
      },
    }),
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
          items: [
            { label: 'My Commands', link: 'commands/commands' },
            {
              label: 'Admin & Mod',
              collapsed: true,
              autogenerate: { directory: 'commands/admin' },
            },
            {
              label: 'Fun',
              autogenerate: { directory: 'commands/fun' },
              collapsed: true,
            },
            {
              label: 'Utility',
              autogenerate: { directory: 'commands/utility' },
              collapsed: true,
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
              collapsed: true,
            },
            {
              label: 'Dashboard',
              autogenerate: { directory: 'selfhost/dashboard' },
              collapsed: true,
            },
          ],
        },
        {
          label: 'Extras',
          autogenerate: { directory: 'extras' },
        },
      ],

      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/iamvikshan/amina',
        },
        {
          icon: 'discord',
          label: 'Discord',
          href: 'https://discord.com/oauth2/authorize?client_id=1035629678632915055',
        },
      ],
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
            content: 'https://amina.vikshan.me' + '/social.webp',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'twitter:image',
            content: 'https://amina.vikshan.me' + '/social.webp',
          },
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/iamvikshan/amina-docs/edit/main/',
      },
      expressiveCode: {
        styleOverrides: { borderRadius: '0.5rem' },
      },
      lastUpdated: true,
      plugins: [],
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
