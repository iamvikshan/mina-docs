import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';
import starlight from '@astrojs/starlight';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@astrojs/react';
import icon from 'astro-icon';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://docs.4mina.app',
  image: { domains: ['images.unsplash.com'] },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    icon({
      include: {
        lucide: ['*'], // Amina uses Lucide icons throughout
      },
    }),
    react(),
    sitemap(),
    starlight({
      title: 'Amina Docs',
      description:
        "your server's guardian, mod tool, and vibe keeper. comprehensive command reference and setup guides.",
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
      },
      sidebar: [
        {
          label: 'Quick Start Guides',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Commands',
          items: [
            { label: 'Overview', link: 'commands/commands' },
            { label: 'Mina AI', link: 'commands/mina-ai' },
            { label: 'Bot Info', link: 'commands/bot' },
            { label: 'Admin & Setup', link: 'commands/admin' },
            { label: 'Moderation', link: 'commands/moderation' },
            { label: 'Music', link: 'commands/music' },
            { label: 'Economy', link: 'commands/economy' },
            { label: 'Fun & Games', link: 'commands/fun' },
            { label: 'Giveaways', link: 'commands/giveaways' },
            { label: 'Social & Invites', link: 'commands/social' },
            { label: 'Stats & Leveling', link: 'commands/stats' },
            { label: 'Info & Lookup', link: 'commands/info' },
            { label: 'Utility', link: 'commands/utility' },
            { label: 'Developer', link: 'commands/dev' },
          ],
        },
        {
          label: 'Self Hosting',
          items: [{ label: 'Get Started', link: 'selfhost/start' }],
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
          label: 'Discord Server',
          href: 'https://discord.gg/mYpKn3sjVT',
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
        Footer: './src/components/ui/starlight/Footer.astro',
        Hero: './src/components/ui/starlight/Hero.astro',
      },
      head: [
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://4mina.app/social.webp',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'twitter:image',
            content: 'https://4mina.app/social.webp',
          },
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/iamvikshan/mina-docs/edit/main/',
      },
      expressiveCode: {
        themes: ['dracula'],
        styleOverrides: { borderRadius: '0.5rem' },
      },
      lastUpdated: true,
    }),
    compressor({
      gzip: true,
      brotli: true,
      zstd: true, // Enable zstd compression as well
    }),
  ],
  vite: {
    css: {
      postcss: './postcss.config.mjs',
    },
    build: {
      cssMinify: 'lightningcss', // Use lightningcss for faster CSS minification
      minify: 'esbuild', // Explicitly use esbuild (default, but good to specify)
      cssCodeSplit: true, // Split CSS per page for better caching
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
            }
          },
        },
        onwarn(warning, warn) {
          // Suppress "Module level directives cause errors when bundled" warnings
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
          // Suppress unused imports from Astro internals
          if (
            warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
            warning.message.includes('@astrojs/internal-helpers')
          )
            return;
          warn(warning);
        },
      },
    },
    logLevel: 'warn',
    resolve: {
      alias: {
        path: 'path-browserify',
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@content': path.resolve(__dirname, './src/content'),
        '@data': path.resolve(__dirname, './src/data'),
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
