import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ArticleList from '@/components/ArticleList';
import type { Article } from '@/lib/types';

function makeArticles(prefix: string, count: number): Article[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    title: `${prefix} article ${i + 1}`,
    url: `https://example.com/${prefix}-${i + 1}`,
    source: 'Example',
    category: 'test-automation',
    publishedAt: '2026-07-16T00:00:00Z',
  }));
}

describe('ArticleList pagination reset', () => {
  beforeEach(() => {
    // jsdom default innerHeight (768) yields 7 articles/page via
    // calculateArticlesPerPage; use enough articles to get multiple pages.
    window.innerHeight = 768;
  });

  it('resets to page 1 when filtered to a different, equal-length article list', () => {
    const setA = makeArticles('a', 20);
    const { rerender } = render(<ArticleList articles={setA} />);

    // Move to page 2.
    fireEvent.click(screen.getByText('Next →'));
    expect(screen.getByText(/Page 2 of/)).toBeInTheDocument();

    // Swap to a different filter result with the same total count.
    const setB = makeArticles('b', 20);
    rerender(<ArticleList articles={setB} />);

    // Page must reset to 1, not remain on page 2 of the new result set.
    expect(screen.getByText(/Page 1 of/)).toBeInTheDocument();
    expect(screen.getByText('b article 1')).toBeInTheDocument();
  });

  it('resets to page 1 when the filtered list shrinks', () => {
    const setA = makeArticles('a', 20);
    const { rerender } = render(<ArticleList articles={setA} />);

    fireEvent.click(screen.getByText('Next →'));
    expect(screen.getByText(/Page 2 of/)).toBeInTheDocument();

    const smaller = makeArticles('a', 10);
    rerender(<ArticleList articles={smaller} />);

    expect(screen.getByText(/Page 1 of/)).toBeInTheDocument();
  });
});
