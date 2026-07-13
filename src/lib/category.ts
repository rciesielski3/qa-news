import type { Category } from './types';

export const CATEGORY_META: Record<Category, { label: string; dot: string; text: string }> = {
  'test-automation': { label: 'test automation', dot: 'bg-signal-pass', text: 'text-signal-pass' },
  ai: { label: 'ai', dot: 'bg-signal-info', text: 'text-signal-info' },
  engineering: { label: 'engineering', dot: 'bg-signal-pin', text: 'text-signal-pin' },
  'qa-practice': { label: 'qa practice', dot: 'bg-signal-practice', text: 'text-signal-practice' },
  tooling: { label: 'tooling', dot: 'bg-signal-tool', text: 'text-signal-tool' },
};
