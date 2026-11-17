import { selectTopPicks } from '@/lib/filtering';
import type { Article } from '@/lib/types';

const article = (id: string, publishedAt: string, score?: number): Article => ({
  id,
  title: `Article ${id}`,
  url: `https://example.com/${id}`,
  source: 'Source',
  category: 'ai',
  publishedAt,
  ...(score === undefined ? {} : { score }),
});

describe('selectTopPicks', () => {
  it('picks the highest scored articles, not the newest', () => {
    const articles = [
      article('newest', '2026-11-17T10:00:00Z', 54),
      article('best', '2026-11-12T10:00:00Z', 155),
      article('second', '2026-11-11T10:00:00Z', 130),
      article('third', '2026-11-13T10:00:00Z', 110),
    ];
    expect(selectTopPicks(articles).map((a) => a.id)).toEqual(['best', 'second', 'third']);
  });

  it('breaks score ties by the newer article', () => {
    const articles = [
      article('older', '2026-11-16T10:00:00Z', 79),
      article('newer', '2026-11-17T10:00:00Z', 79),
      article('low', '2026-11-17T11:00:00Z', 50),
    ];
    expect(selectTopPicks(articles, 2).map((a) => a.id)).toEqual(['newer', 'older']);
  });

  it('ranks articles without a score last', () => {
    const articles = [
      article('unscored', '2026-11-17T10:00:00Z'),
      article('scored', '2026-11-10T10:00:00Z', 1),
    ];
    expect(selectTopPicks(articles).map((a) => a.id)).toEqual(['scored', 'unscored']);
  });

  it('does not reorder the input list', () => {
    const articles = [article('a', '2026-11-17T10:00:00Z', 1), article('b', '2026-11-16T10:00:00Z', 9)];
    selectTopPicks(articles);
    expect(articles.map((a) => a.id)).toEqual(['a', 'b']);
  });

  it('returns fewer picks when there are fewer articles', () => {
    expect(selectTopPicks([article('only', '2026-11-17T10:00:00Z', 5)])).toHaveLength(1);
    expect(selectTopPicks([])).toEqual([]);
  });
});
