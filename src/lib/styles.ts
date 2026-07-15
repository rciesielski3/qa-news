import type { Category } from './types';

// Color mapping for the 5-category palette (WCAG AA compliant)
const CATEGORY_COLORS: Record<Category, { bright: string; text: string; bg: string }> = {
  'test-automation': {
    bright: '#0EA5E9',
    text: '#0369A1',
    bg: '#F0F9FF',
  },
  'qa-practice': {
    bright: '#A855F7',
    text: '#6B21A8',
    bg: '#FAF5FF',
  },
  tooling: {
    bright: '#F97316',
    text: '#92400E',
    bg: '#FEF3C7',
  },
  engineering: {
    bright: '#10B981',
    text: '#065F46',
    bg: '#F0FDF4',
  },
  ai: {
    bright: '#06B6D4',
    text: '#155E75',
    bg: '#F0F9FA',
  },
};

// Category display labels
const CATEGORY_LABELS: Record<Category, string> = {
  'test-automation': 'Test Automation',
  'qa-practice': 'QA Practice',
  tooling: 'Tooling',
  engineering: 'Engineering',
  ai: 'AI',
};

/**
 * Get the bright color for a category (hex string)
 * @param category - The category name
 * @returns The bright color hex value
 */
export function categoryColor(category: string): string {
  const colors = CATEGORY_COLORS[category as Category];
  return colors ? colors.bright : '#0EA5E9'; // fallback to test-automation
}

/**
 * Get the text color for a category (hex string)
 * @param category - The category name
 * @returns The text color hex value
 */
export function categoryTextColor(category: string): string {
  const colors = CATEGORY_COLORS[category as Category];
  return colors ? colors.text : '#0369A1'; // fallback to test-automation
}

/**
 * Get the background color for a category (hex string)
 * @param category - The category name
 * @returns The background color hex value
 */
export function categoryBgColor(category: string): string {
  const colors = CATEGORY_COLORS[category as Category];
  return colors ? colors.bg : '#F0F9FF'; // fallback to test-automation
}

/**
 * Get the display label for a category
 * @param category - The category name
 * @returns The category display label
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category as Category] || 'Unknown';
}

/**
 * Get the Tailwind class for the bright category color
 * @param category - The category name
 * @returns The Tailwind color class
 */
export function categoryBrightClass(category: string): string {
  const classMap: Record<Category, string> = {
    'test-automation': 'text-category-test-automation-bright',
    'qa-practice': 'text-category-qa-practice-bright',
    tooling: 'text-category-tooling-bright',
    engineering: 'text-category-engineering-bright',
    ai: 'text-category-ai-bright',
  };
  return classMap[category as Category] || 'text-category-test-automation-bright';
}

/**
 * Get the Tailwind class for the text category color
 * @param category - The category name
 * @returns The Tailwind color class
 */
export function categoryTextClass(category: string): string {
  const classMap: Record<Category, string> = {
    'test-automation': 'text-category-test-automation-text',
    'qa-practice': 'text-category-qa-practice-text',
    tooling: 'text-category-tooling-text',
    engineering: 'text-category-engineering-text',
    ai: 'text-category-ai-text',
  };
  return classMap[category as Category] || 'text-category-test-automation-text';
}

/**
 * Get the Tailwind class for the background category color
 * @param category - The category name
 * @returns The Tailwind background color class
 */
export function categoryBgClass(category: string): string {
  const classMap: Record<Category, string> = {
    'test-automation': 'bg-category-test-automation-bg',
    'qa-practice': 'bg-category-qa-practice-bg',
    tooling: 'bg-category-tooling-bg',
    engineering: 'bg-category-engineering-bg',
    ai: 'bg-category-ai-bg',
  };
  return classMap[category as Category] || 'bg-category-test-automation-bg';
}
