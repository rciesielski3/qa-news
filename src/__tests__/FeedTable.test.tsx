import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ArticleList from '@/components/ArticleList';
import { applyFilters } from '@/lib/filtering';
import type { Article, Category } from '@/lib/types';

function make(count: number, category: Category = 'ai', prefix = 'a'): Article[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${i + 1}`,
    title: `${prefix} story ${i + 1}`,
    url: `https://e.com/${prefix}${i + 1}`,
    source: 'Src',
    category,
    publishedAt: '2026-11-23T10:00:00Z',
    score: 50 + i,
  }));
}

beforeEach(() => {
  window.innerHeight = 768; // 7 rows per batch
});

describe('feed table', () => {
  it('renders a column header and numbered rows with category, source, date and score', () => {
    const { container } = render(<ArticleList articles={make(3)} />);
    const head = container.querySelector('.feed-head');
    expect(head).toHaveTextContent('Category');
    expect(head).toHaveTextContent('Story');
    expect(head).toHaveTextContent('Source · Date');
    const rows = container.querySelectorAll('li.feed-row');
    expect(rows).toHaveLength(3);
    expect(rows[0].querySelector('.ix')).toHaveTextContent('01');
    expect(rows[2].querySelector('.ix')).toHaveTextContent('03');
    expect(rows[0]).toHaveAttribute('data-cat', 'ai');
    expect(rows[0]).toHaveTextContent('AI');
    expect(rows[0]).toHaveTextContent('Src');
    expect(rows[0]).toHaveTextContent('score 50');
    expect(screen.getByRole('link', { name: 'a story 1' })).toHaveAttribute('href', 'https://e.com/a1');
  });

  it('excludes top picks from the table', () => {
    render(<ArticleList articles={make(4)} topPickIds={new Set(['a1', 'a2'])} />);
    expect(screen.queryByText('a story 1')).not.toBeInTheDocument();
    expect(screen.getByText('a story 3')).toBeInTheDocument();
  });

  it('paginates with Load More and continues the row numbering', async () => {
    const { container } = render(<ArticleList articles={make(20)} />);
    const rowSel = 'li.feed-row:not(.feed-row-skel)';
    const first = container.querySelectorAll(rowSel).length;
    expect(first).toBeLessThan(20);
    fireEvent.click(screen.getByText('Load More'));
    await waitFor(() => expect(container.querySelectorAll(rowSel).length).toBeGreaterThan(first));
    const rows = container.querySelectorAll(rowSel);
    expect(rows[rows.length - 1].querySelector('.ix')).toHaveTextContent(String(rows.length).padStart(2, '0'));
  });

  it('shows only the filtered category when the list is filtered', () => {
    const all = [...make(3, 'ai', 'ai'), ...make(2, 'tooling', 'tl')];
    const { container, rerender } = render(<ArticleList articles={all} />);
    expect(container.querySelectorAll('li.feed-row')).toHaveLength(5);
    rerender(<ArticleList articles={applyFilters(all, { category: 'tooling' })} />);
    const rows = container.querySelectorAll('li.feed-row');
    expect(rows).toHaveLength(2);
    rows.forEach((r) => expect(r).toHaveAttribute('data-cat', 'tooling'));
  });
});
