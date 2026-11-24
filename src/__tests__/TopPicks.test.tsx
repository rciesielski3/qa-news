import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TopPicks from '@/components/TopPicks';
import { selectTopPicks } from '@/lib/filtering';
import type { Article } from '@/lib/types';

function art(id: string, score: number, over: Partial<Article> = {}): Article {
  return {
    id,
    title: `Title ${id}`,
    url: `https://example.com/${id}`,
    source: 'Src',
    category: 'ai',
    publishedAt: '2026-11-23T10:00:00Z',
    score,
    ...over,
  };
}

describe('TopPicks', () => {
  it('renders ranked cards in order inside the .picks grid (first = featured)', () => {
    const picks = selectTopPicks([art('low', 10), art('best', 90), art('mid', 50), art('x', 5)]);
    const { container } = render(<TopPicks articles={picks} />);
    const grid = container.querySelector('.picks');
    expect(grid).toBeInTheDocument();
    const cards = Array.from(grid!.querySelectorAll('article.pickcard'));
    expect(cards).toHaveLength(3);
    expect(cards.map((c) => c.getAttribute('data-rank'))).toEqual(['1', '2', '3']);
    expect(cards.map((c) => c.querySelector('h3')?.textContent)).toEqual(['Title best', 'Title mid', 'Title low']);
    expect(grid!.firstElementChild).toBe(cards[0]);
  });

  it('shows rank, score and a stretched Read Article link per card', () => {
    render(<TopPicks articles={[art('a', 77)]} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('77')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Read Article/ })).toHaveAttribute('href', 'https://example.com/a');
  });

  it('shows skeletons while loading', () => {
    const { container } = render(<TopPicks articles={[]} isLoading />);
    expect(container.querySelectorAll('.pickcard-skel')).toHaveLength(3);
    expect(container.querySelector('.picks')).toHaveAttribute('aria-busy', 'true');
  });

  it('shows an empty message when there are no picks', () => {
    render(<TopPicks articles={[]} />);
    expect(screen.getByText('No top picks for today.')).toBeInTheDocument();
  });
});
