import type { Category } from './types';
import { getCategoryColor, getCategoryLabel, categoryColorClass, categoryTextColorClass } from './styles';

export const CATEGORY_META: Record<Category, { label: string; color: string; dot: string; text: string }> = {
  'test-automation': {
    color: getCategoryColor('test-automation'),
    label: getCategoryLabel('test-automation'),
    dot: categoryColorClass('test-automation'),
    text: categoryTextColorClass('test-automation'),
  },
  'qa-practice': {
    color: getCategoryColor('qa-practice'),
    label: getCategoryLabel('qa-practice'),
    dot: categoryColorClass('qa-practice'),
    text: categoryTextColorClass('qa-practice'),
  },
  'tooling': {
    color: getCategoryColor('tooling'),
    label: getCategoryLabel('tooling'),
    dot: categoryColorClass('tooling'),
    text: categoryTextColorClass('tooling'),
  },
  'engineering': {
    color: getCategoryColor('engineering'),
    label: getCategoryLabel('engineering'),
    dot: categoryColorClass('engineering'),
    text: categoryTextColorClass('engineering'),
  },
  'ai': {
    color: getCategoryColor('ai'),
    label: getCategoryLabel('ai'),
    dot: categoryColorClass('ai'),
    text: categoryTextColorClass('ai'),
  },
};
