import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // "ink" scale — a dark charcoal-navy, not pure black
        ink: {
          950: '#0a0d13',
          900: '#0b0e14',
          800: '#12161f',
          700: '#191f2c',
          600: '#232838',
          500: '#323a4d',
        },
        paper: {
          DEFAULT: '#e7e9ee', // primary text
          muted: '#8b93a7', // secondary text
          faint: '#7683a0', // tertiary / disabled — tuned to clear WCAG AA (4.5:1) on ink-900
        },
        signal: {
          pass: '#3ecf8e', // test-automation / "live" green
          pin: '#f5a623', // highlighted / editor's pick amber
          info: '#5b9df9', // ai / links cyan-blue
          practice: '#c792ea', // qa-practice violet
          tool: '#e2777a', // tooling rose
        },
        // 5-category color palette (WCAG AA compliant)
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
