/** @type {import('tailwindcss').Config} */
import prelinePlugin from 'preline/preline';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/preline/preline.js',
  ],
  plugins: [prelinePlugin],
};
