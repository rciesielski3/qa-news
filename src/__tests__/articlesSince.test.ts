import { getArticlesSince, getTodayArticles } from '@/lib/filtering';
import { getArticleSubtitle } from '@/lib/summarize';
import type { Article } from '@/lib/types';

const now = new Date().toISOString();

function makeArticle(overrides: Partial<Article>): Article {
  return {
    id: 'a',
    title: 'Headline',
    url: 'https://example.com',
    source: 'Test',
    category: 'ai',
    publishedAt: now,
    ...overrides,
  } as Article;
}

describe('getArticlesSince', () => {
  it('keeps the raw summary text so abbreviations and versions are not split', () => {
    const raw = 'The U.S. team shipped v2.0 today. It was a large release.';
    const [result] = getArticlesSince([makeArticle({ summary: raw })], 7);

    expect(result.summary).toBe(raw);
    expect(getArticleSubtitle(result)).toBe('The U.S. team shipped v2.0 today.');
  });

  it('does not substitute the title when summary is missing', () => {
    const [result] = getArticlesSince([makeArticle({ title: 'Only A Title Here' })], 1);

    expect(result.summary).toBeUndefined();
    expect(getArticleSubtitle(result)).toBe('');
  });

  it('filters by publish date and returns today articles for the daily page', () => {
    const old = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const articles = [makeArticle({ id: 'new' }), makeArticle({ id: 'old', publishedAt: old })];

    expect(getTodayArticles(articles).map((a) => a.id)).toEqual(['new']);
  });
});
