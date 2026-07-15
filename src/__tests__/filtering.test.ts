import { applyFilters, parseFilterParams, serializeFilterParams, type Article } from '@/lib/filtering';

const mockArticles: Article[] = [
  { id: '1', title: 'Test 1', category: 'ai', tags: ['llm'], url: '#', publishedAt: '2026-07-15' },
  { id: '2', title: 'Test 2', category: 'testing', tags: ['automation'], url: '#', publishedAt: '2026-07-15' },
  { id: '3', title: 'Test 3', category: 'ai', tags: ['eval'], url: '#', publishedAt: '2026-07-15' },
];

describe('filtering', () => {
  test('applyFilters with no filters returns all articles', () => {
    const result = applyFilters(mockArticles, {});
    expect(result).toHaveLength(3);
  });

  test('applyFilters by category', () => {
    const result = applyFilters(mockArticles, { category: 'ai' });
    expect(result).toHaveLength(2);
    expect(result.every((a) => a.category === 'ai')).toBe(true);
  });

  test('applyFilters by tags (OR logic)', () => {
    const result = applyFilters(mockArticles, { tags: ['llm', 'automation'] });
    expect(result).toHaveLength(2); // Articles with either tag
  });

  test('applyFilters by category AND tags', () => {
    const result = applyFilters(mockArticles, { category: 'ai', tags: ['llm'] });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  test('parseFilterParams from URL', () => {
    const params = parseFilterParams({ category: 'ai', tags: 'llm,eval' });
    expect(params).toEqual({ category: 'ai', tags: ['llm', 'eval'] });
  });

  test('serializeFilterParams to URL', () => {
    const params = serializeFilterParams({ category: 'ai', tags: ['llm', 'eval'] });
    expect(params.toString()).toBe('category=ai&tags=llm%2Ceval');
  });
});
