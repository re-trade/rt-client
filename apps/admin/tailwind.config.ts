import type { Config } from 'tailwindcss';

const config: any = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#6366f1', // Indigo
          secondary: '#8b5cf6', // Violet
          accent: '#06b6d4', // Cyan
          neutral: '#64748b', // Slate
          'base-100': '#ffffff',
          'base-200': '#f8fafc',
          'base-300': '#f1f5f9',
          info: '#0ea5e9', // Sky
          success: '#10b981', // Emerald
          warning: '#f59e0b', // Amber
          error: '#ef4444', // Red
        },
        dark: {
          primary: '#818cf8', // Indigo light
          secondary: '#a78bfa', // Violet light
          accent: '#22d3ee', // Cyan light
          neutral: '#94a3b8', // Slate light
          'base-100': '#0f172a', // Slate 900
          'base-200': '#1e293b', // Slate 800
          'base-300': '#334155', // Slate 700
          info: '#38bdf8', // Sky light
          success: '#34d399', // Emerald light
          warning: '#fbbf24', // Amber light
          error: '#f87171', // Red light
        },
      },
    ],
  },
};

export default config;
