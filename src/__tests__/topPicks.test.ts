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

  it('orders several unscored articles by date and keeps a score of 0 above them', () => {
    const articles = [
      article('unscored-old', '2026-11-10T10:00:00Z'),
      article('zero', '2026-11-01T10:00:00Z', 0),
      article('unscored-new', '2026-11-17T10:00:00Z'),
    ];
    expect(selectTopPicks(articles).map((a) => a.id)).toEqual(['zero', 'unscored-new', 'unscored-old']);
  });

  it('ranks an unreadable date last among equal scores', () => {
    const articles = [
      article('bad-date', 'not a date', 10),
      article('dated', '2026-11-01T10:00:00Z', 10),
      article('newer', '2026-11-02T10:00:00Z', 10),
    ];
    expect(selectTopPicks(articles).map((a) => a.id)).toEqual(['newer', 'dated', 'bad-date']);
  });

  it('treats a non-numeric score as unscored', () => {
    const articles = [
      { ...article('string-score', '2026-11-17T10:00:00Z'), score: 'abc' as unknown as number },
      article('scored', '2026-11-01T10:00:00Z', 1),
    ];
    expect(selectTopPicks(articles).map((a) => a.id)).toEqual(['scored', 'string-score']);
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

describe('selectTopPicks per-source cap', () => {
  const from = (id: string, source: string, score: number, publishedAt = '2026-11-17T10:00:00Z'): Article => ({
    ...article(id, publishedAt, score),
    source,
  });

  it('picks the top three from distinct sources in rank order', () => {
    const articles = [from('a', 'A', 90), from('b', 'B', 80), from('c', 'C', 70), from('d', 'D', 60)];
    expect(selectTopPicks(articles).map((a) => a.id)).toEqual(['a', 'b', 'c']);
  });

  it('skips further articles of a source that already has a pick', () => {
    const articles = [from('a1', 'A', 90), from('a2', 'A', 85), from('b', 'B', 80), from('c', 'C', 70)];
    expect(selectTopPicks(articles).map((a) => a.id)).toEqual(['a1', 'b', 'c']);
  });

  it('fills remaining slots with the best remaining articles when sources run out', () => {
    const articles = [from('a1', 'A', 90), from('a2', 'A', 85), from('b1', 'B', 80), from('b2', 'B', 75), from('a3', 'A', 10)];
    // distinct picks a1, b1; the fill takes a2 (best remaining) and rank order is kept.
    expect(selectTopPicks(articles).map((a) => a.id)).toEqual(['a1', 'a2', 'b1']);
  });

  it('breaks score ties newer first', () => {
    const articles = [
      from('old', 'A', 50, '2026-11-10T10:00:00Z'),
      from('new', 'B', 50, '2026-11-12T10:00:00Z'),
      from('same-source-new', 'A', 50, '2026-11-14T10:00:00Z'),
    ];
    expect(selectTopPicks(articles).map((a) => a.id)).toEqual(['same-source-new', 'new', 'old']);
  });

  it('handles empty and short input', () => {
    expect(selectTopPicks([])).toEqual([]);
    expect(selectTopPicks([from('a', 'A', 1), from('a2', 'A', 2)]).map((a) => a.id)).toEqual(['a2', 'a']);
  });

  it('does not merge articles with missing or empty sources', () => {
    const articles = [
      { ...from('x', '', 90) },
      { ...from('y', '', 80) },
      { ...from('z', '  ', 70) },
      { ...from('w', 'W', 60) },
    ];
    expect(selectTopPicks(articles).map((a) => a.id)).toEqual(['x', 'y', 'z']);
    const noSource = articles.map((a) => ({ ...a, source: undefined as unknown as string }));
    expect(selectTopPicks(noSource).map((a) => a.id)).toEqual(['x', 'y', 'z']);
  });

  it('maxPerSource: Infinity restores pure score order', () => {
    const articles = [from('a1', 'A', 90), from('a2', 'A', 85), from('a3', 'A', 80), from('b', 'B', 70)];
    expect(selectTopPicks(articles, 3, { maxPerSource: Infinity }).map((a) => a.id)).toEqual(['a1', 'a2', 'a3']);
    expect(selectTopPicks(articles, 3, { maxPerSource: 2 }).map((a) => a.id)).toEqual(['a1', 'a2', 'b']);
  });

  it('does not mutate the input', () => {
    const articles = [from('a1', 'A', 10), from('a2', 'A', 90), from('b', 'B', 50)];
    const copy = [...articles];
    selectTopPicks(articles);
    expect(articles).toEqual(copy);
  });
});
