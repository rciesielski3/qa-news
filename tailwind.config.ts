import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // "ink" scale — a dark charcoal-navy, not pure black.
        // Light shades (50–400) support the light theme; dark shades (500–950) the dark theme.
        ink: {
          50: '#f4f5f7',
          100: '#e7e9ee',
          200: '#d3d7e0',
          300: '#aab0c0',
          400: '#6b7280',
          500: '#323a4d',
          600: '#232838',
          700: '#191f2c',
          800: '#12161f',
          900: '#0b0e14',
          950: '#0a0d13',
        },
        paper: {
          DEFAULT: '#e7e9ee', // primary text
          muted: '#8b93a7', // secondary text
          faint: '#7683a0', // tertiary / disabled — tuned to clear WCAG AA (4.5:1) on ink-900
        },
        signal: {
          pass: '#3ecf8e', // "live" green — used for links, focus, indicators
          pin: '#f5a623', // highlighted / editor's pick amber
          info: '#5b9df9', // links cyan-blue
          practice: '#c792ea', // alternate interactive color
          tool: '#e2777a', // alternate interactive color
        },
        // 5-category color palette (WCAG AA compliant) — unified source in lib/styles.ts
        category: {
          'test-automation-bright': '#0EA5E9',
          'test-automation-text': '#0369A1',
          'test-automation-bg': '#F0F9FF',
          'qa-practice-bright': '#A855F7',
          'qa-practice-text': '#6B21A8',
          'qa-practice-bg': '#FAF5FF',
          'tooling-bright': '#F97316',
          'tooling-text': '#92400E',
          'tooling-bg': '#FEF3C7',
          'engineering-bright': '#10B981',
          'engineering-text': '#065F46',
          'engineering-bg': '#F0FDF4',
          'ai-bright': '#06B6D4',
          'ai-text': '#155E75',
          'ai-bg': '#F0F9FA',
        },
      },
      fontFamily: {
        serif: ['"IBM Plex Serif"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        content: '52rem',
      },
    },
  },
  plugins: [],
};

export default config;
