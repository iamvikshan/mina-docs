/** @type {import('tailwindcss').Config} */
import prelinePlugin from 'preline/preline';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      colors: {
        // === AKAME'S CRIMSON ===
        'amina-crimson': '#DC143C',
        'blood-red': '#8B0000',
        'rose-red': '#E63946',

        // === NIGHT RAID'S DARKNESS ===
        'midnight-black': '#0A0A0A',
        'shadow-gray': '#1A1A1A',
        'steel-gray': '#2D2D2D',
        'slate-gray': '#3D3D3D',

        // === IMPERIAL GOLD ===
        'imperial-gold': '#FFD700',
        'amber-gold': '#FFA500',
        bronze: '#CD7F32',

        // === DIGITAL BLUE ===
        'electric-blue': '#1E90FF',
        'cyber-blue': '#00CED1',
        'ice-blue': '#87CEEB',

        // === DISCORD INTEGRATION ===
        'discord-blurple': '#5865F2',
        'discord-green': '#57F287',
        'discord-red': '#ED4245',
        'discord-gray': '#36393F',

        // === NEUTRAL/UTILITY ===
        'pure-white': '#FFFFFF',
        'off-white': '#F5F5F5',
      },
      fontFamily: {
        heading: ['Rajdhani', 'Orbitron', 'Space Grotesk', 'sans-serif'],
        body: ['Inter', 'Poppins', 'sans-serif'],
        dialogue: ['Quicksand', 'Comfortaa', 'cursive'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-crimson': '0 0 20px rgba(220, 20, 60, 0.6)',
        'glow-blue': '0 0 20px rgba(30, 144, 255, 0.6)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.6)',
        'glow-green': '0 0 20px rgba(87, 242, 135, 0.6)',
        'glow-red': '0 0 20px rgba(220, 20, 60, 0.6)',
      },
    },
  },
  plugins: [prelinePlugin],
};
