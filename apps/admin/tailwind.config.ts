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
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#f59e0b',
          neutral: '#374151',
          'base-100': '#ffffff',
          info: '#0ea5e9',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#f59e0b',
          neutral: '#374151',
          'base-100': '#1f2937',
          info: '#0ea5e9',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
    ],
  },
};

export default config; 