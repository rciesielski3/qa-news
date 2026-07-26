import { applyFilters, parseFilterParams, serializeFilterParams, type Article } from '@/lib/filtering';

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Article 1',
    summary: 'Summary 1',
    url: 'http://example.com/1',
    source: 'Source 1',
    category: 'ai',
    publishedAt: '2026-07-20T10:00:00Z',
    tags: ['llm', 'prompt-engineering'],
  },
  {
    id: '2',
    title: 'Article 2',
    summary: 'Summary 2',
    url: 'http://example.com/2',
    source: 'Source 2',
    category: 'test-automation',
    publishedAt: '2026-07-20T09:00:00Z',
    tags: ['jest', 'testing'],
  },
  {
    id: '3',
    title: 'Article 3',
    summary: 'Summary 3',
    url: 'http://example.com/3',
    source: 'Source 3',
    category: 'ai',
    publishedAt: '2026-07-20T08:00:00Z',
    tags: ['agents', 'llm'],
  },
  {
    id: '4',
    title: 'Article 4',
    summary: 'Summary 4',
    url: 'http://example.com/4',
    source: 'Source 4',
    category: 'engineering',
    publishedAt: '2026-07-20T07:00:00Z',
    tags: ['architecture'],
  },
];

describe('parseFilterParams', () => {
  it('returns empty filters when no params provided', () => {
    const result = parseFilterParams({});
    expect(result.category).toBeUndefined();
    expect(result.tags).toBeUndefined();
  });

  it('extracts category filter from params', () => {
    const result = parseFilterParams({ category: 'ai' });
    expect(result.category).toBe('ai');
    expect(result.tags).toBeUndefined();
  });

  it('extracts single tag from params', () => {
    const result = parseFilterParams({ tags: 'llm' });
    expect(result.category).toBeUndefined();
    expect(result.tags).toEqual(['llm']);
  });

  it('extracts multiple tags from comma-separated string', () => {
    const result = parseFilterParams({ tags: 'llm,prompt-engineering,agents' });
    expect(result.category).toBeUndefined();
    expect(result.tags).toEqual(['llm', 'prompt-engineering', 'agents']);
  });

  it('extracts both category and tags', () => {
    const result = parseFilterParams({ category: 'ai', tags: 'llm,agents' });
    expect(result.category).toBe('ai');
    expect(result.tags).toEqual(['llm', 'agents']);
  });

  it('handles whitespace in comma-separated tags', () => {
    const result = parseFilterParams({ tags: 'llm, prompt-engineering , agents' });
    expect(result.tags).toEqual(['llm', 'prompt-engineering', 'agents']);
  });
});

describe('applyFilters', () => {
  it('returns all articles when no filters applied', () => {
    const filters = { category: undefined, tags: undefined };
    const result = applyFilters(mockArticles, filters);
    expect(result).toHaveLength(4);
    expect(result).toEqual(mockArticles);
  });

  it('filters articles by category', () => {
    const filters = { category: 'ai' };
    const result = applyFilters(mockArticles, filters);
    expect(result).toHaveLength(2);
    expect(result.every((a) => a.category === 'ai')).toBe(true);
    expect(result.map((a) => a.id)).toEqual(['1', '3']);
  });

  it('filters articles by single tag (OR logic)', () => {
    const filters = { tags: ['jest'] };
    const result = applyFilters(mockArticles, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters articles by multiple tags with OR logic', () => {
    const filters = { tags: ['llm', 'architecture'] };
    const result = applyFilters(mockArticles, filters);
    expect(result).toHaveLength(3);
    expect(result.map((a) => a.id).sort()).toEqual(['1', '3', '4']);
  });

  it('filters articles by category AND tags with AND logic', () => {
    const filters = { category: 'ai', tags: ['llm'] };
    const result = applyFilters(mockArticles, filters);
    expect(result).toHaveLength(2);
    expect(result.every((a) => a.category === 'ai' && a.tags.includes('llm'))).toBe(true);
    expect(result.map((a) => a.id).sort()).toEqual(['1', '3']);
  });
});

describe('serializeFilterParams', () => {
  it('serializes filters to URL params', () => {
    const params = serializeFilterParams({ category: 'ai', tags: ['llm', 'eval'] });
    expect(params.toString()).toBe('category=ai&tags=llm%2Ceval');
  });
});
