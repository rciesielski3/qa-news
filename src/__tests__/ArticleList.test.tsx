import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

describe('ArticleList with Load More pagination', () => {
  beforeEach(() => {
    // jsdom default innerHeight (768) yields 7 articles/page via
    // calculateArticlesPerPage; use enough articles to test multiple batches.
    window.innerHeight = 768;
  });

  it('displays initial batch of articles and shows Load More button when more exist', () => {
    const articles = makeArticles('a', 20);
    render(<ArticleList articles={articles} />);

    // Should show first article
    expect(screen.getByText('a article 1')).toBeInTheDocument();

    // Load More button should be visible
    expect(screen.getByText('Load More')).toBeInTheDocument();
  });

  it('appends next batch when Load More is clicked', async () => {
    const articles = makeArticles('a', 20);
    render(<ArticleList articles={articles} />);

    // Get initial count of displayed articles
    const initialArticles = screen.getAllByText(/^a article \d+$/);
    const initialCount = initialArticles.length;

    // Click Load More
    const loadMoreButton = screen.getByText('Load More');
    fireEvent.click(loadMoreButton);

    // Wait for loading animation to complete
    await waitFor(() => {
      expect(loadMoreButton).not.toHaveTextContent('Loading...');
    }, { timeout: 1000 });

    // More articles should now be displayed
    const allArticles = screen.getAllByText(/^a article \d+$/);
    expect(allArticles.length).toBeGreaterThan(initialCount);
  });

  it('hides Load More button when all articles are displayed', async () => {
    const articles = makeArticles('a', 5);
    render(<ArticleList articles={articles} />);

    // Should show Load More if not all articles fit in first batch
    const loadMoreButton = screen.queryByText('Load More');

    if (loadMoreButton) {
      // If there's a Load More button, click it until gone
      while (screen.queryByText('Load More')) {
        fireEvent.click(screen.getByText('Load More'));
        await waitFor(() => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        }, { timeout: 1000 });
      }
    }

    // Load More button should be gone
    expect(screen.queryByText('Load More')).not.toBeInTheDocument();
  });

  it('resets displayed count when article list changes', () => {
    const setA = makeArticles('a', 20);
    const { rerender } = render(<ArticleList articles={setA} />);

    // Verify we're showing first batch
    expect(screen.getByText('a article 1')).toBeInTheDocument();

    // Swap to a different filter result
    const setB = makeArticles('b', 20);
    rerender(<ArticleList articles={setB} />);

    // Should still show first article from new set
    expect(screen.getByText('b article 1')).toBeInTheDocument();
  });

  it('handles filtered articles (excluding top picks)', () => {
    const articles = makeArticles('a', 20);
    const topPickIds = new Set(['a-1', 'a-2']);

    render(<ArticleList articles={articles} topPickIds={topPickIds} />);

    // Top picks should not appear in the list
    expect(screen.queryByText('a article 1')).not.toBeInTheDocument();
    expect(screen.queryByText('a article 2')).not.toBeInTheDocument();

    // But the third article should appear
    expect(screen.getByText('a article 3')).toBeInTheDocument();
  });

  it('shows empty state when no articles', () => {
    const articles: Article[] = [];
    render(<ArticleList articles={articles} />);

    expect(screen.getByText('No articles found.')).toBeInTheDocument();
    expect(screen.queryByText('Load More')).not.toBeInTheDocument();
  });
});

describe('Load More button styling', () => {
  beforeEach(() => {
    window.innerHeight = 768;
  });

  it('Load More button container has no top border', () => {
    const articles = Array.from({ length: 20 }, (_, i) => ({
      id: `article-${i + 1}`,
      title: `Article ${i + 1}`,
      url: `https://example.com/${i + 1}`,
      source: 'Example',
      category: 'test-automation',
      publishedAt: '2026-07-16T00:00:00Z',
    }));
    render(<ArticleList articles={articles} />);

    const loadMoreBtn = screen.getByRole('button', { name: /Load More/i });
    const container = loadMoreBtn.parentElement;
    expect(container).not.toHaveClass('border-t');
  });

  it('Load More button has hover scale effect', () => {
    const articles = Array.from({ length: 20 }, (_, i) => ({
      id: `article-${i + 1}`,
      title: `Article ${i + 1}`,
      url: `https://example.com/${i + 1}`,
      source: 'Example',
      category: 'test-automation',
      publishedAt: '2026-07-16T00:00:00Z',
    }));
    render(<ArticleList articles={articles} />);

    const loadMoreBtn = screen.getByRole('button', { name: /Load More/i });
    expect(loadMoreBtn).toHaveClass('hover:scale-105');
  });

  it('Load More button has hover background color', () => {
    const articles = Array.from({ length: 20 }, (_, i) => ({
      id: `article-${i + 1}`,
      title: `Article ${i + 1}`,
      url: `https://example.com/${i + 1}`,
      source: 'Example',
      category: 'test-automation',
      publishedAt: '2026-07-16T00:00:00Z',
    }));
    render(<ArticleList articles={articles} />);

    const loadMoreBtn = screen.getByRole('button', { name: /Load More/i });
    const classStr = loadMoreBtn.className;
    expect(classStr).toMatch(/hover:bg-/);
  });

  it('Load More button has active state color', () => {
    const articles = Array.from({ length: 20 }, (_, i) => ({
      id: `article-${i + 1}`,
      title: `Article ${i + 1}`,
      url: `https://example.com/${i + 1}`,
      source: 'Example',
      category: 'test-automation',
      publishedAt: '2026-07-16T00:00:00Z',
    }));
    render(<ArticleList articles={articles} />);

    const loadMoreBtn = screen.getByRole('button', { name: /Load More/i });
    const classStr = loadMoreBtn.className;
    expect(classStr).toMatch(/active:bg-/);
  });

  it('Load More button has smooth transition', () => {
    const articles = Array.from({ length: 20 }, (_, i) => ({
      id: `article-${i + 1}`,
      title: `Article ${i + 1}`,
      url: `https://example.com/${i + 1}`,
      source: 'Example',
      category: 'test-automation',
      publishedAt: '2026-07-16T00:00:00Z',
    }));
    render(<ArticleList articles={articles} />);

    const loadMoreBtn = screen.getByRole('button', { name: /Load More/i });
    expect(loadMoreBtn).toHaveClass('transition-all');
    expect(loadMoreBtn).toHaveClass('duration-150');
  });
});
