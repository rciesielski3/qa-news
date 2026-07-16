import type { Category } from './types';

// Unified color palette — single source of truth (WCAG AA compliant)
export const CATEGORY_COLORS: Record<string, {
  bright: string
  text: string
  bg: string
  brightClass: string
  textClass: string
  bgClass: string
}> = {
  'test-automation': {
    bright: '#0EA5E9',      // bright blue for dots, buttons, borders
    text: '#0369A1',         // dark blue for labels, readable text
    bg: '#F0F9FF',           // very light blue for backgrounds
    brightClass: 'bg-blue-400',
    textClass: 'text-blue-900',
    bgClass: 'bg-blue-50',
  },
  'qa-practice': {
    bright: '#A855F7',
    text: '#6B21A8',
    bg: '#FAF5FF',
    brightClass: 'bg-purple-400',
    textClass: 'text-purple-900',
    bgClass: 'bg-purple-50',
  },
  'tooling': {
    bright: '#F97316',
    text: '#92400E',
    bg: '#FEF3C7',
    brightClass: 'bg-orange-400',
    textClass: 'text-orange-900',
    bgClass: 'bg-orange-50',
  },
  'engineering': {
    bright: '#10B981',
    text: '#065F46',
    bg: '#F0FDF4',
    brightClass: 'bg-green-400',
    textClass: 'text-green-900',
    bgClass: 'bg-green-50',
  },
  'ai': {
    bright: '#06B6D4',
    text: '#155E75',
    bg: '#F0F9FA',
    brightClass: 'bg-cyan-400',
    textClass: 'text-cyan-900',
    bgClass: 'bg-cyan-50',
  },
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category]?.bright || '#6B7280'
}

export function getCategoryTextColor(category: string): string {
  return CATEGORY_COLORS[category]?.text || '#374151'
}

export function getCategoryBgColor(category: string): string {
  return CATEGORY_COLORS[category]?.bg || '#F9FAFB'
}

export function categoryColorClass(category: string): string {
  return CATEGORY_COLORS[category]?.brightClass || 'bg-gray-400'
}

export function categoryTextColorClass(category: string): string {
  return CATEGORY_COLORS[category]?.textClass || 'text-gray-900'
}

export function categoryBgColorClass(category: string): string {
  return CATEGORY_COLORS[category]?.bgClass || 'bg-gray-50'
}

export const CATEGORY_LABELS: Record<Category, string> = {
  'test-automation': 'Test Automation',
  'qa-practice': 'QA Practice',
  'tooling': 'Tooling',
  'engineering': 'Engineering',
  'ai': 'AI',
}

export const CATEGORIES_WITH_LABELS: Array<{ id: Category; label: string }> = [
  { id: 'test-automation', label: 'Test Automation' },
  { id: 'qa-practice', label: 'QA Practice' },
  { id: 'tooling', label: 'Tooling' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'ai', label: 'AI' },
]

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category as Category] || category
}


export function categoryBrightClass(category: string): string {
  return categoryColorClass(category)
}

export function categoryTextClass(category: string): string {
  return categoryTextColorClass(category)
}

export function categoryBgClass(category: string): string {
  return categoryBgColorClass(category)
}
