import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroBento from '@/components/HeroBento';
import { computeStats } from '@/lib/stats';
import type { Article, Category } from '@/lib/types';

let n = 0;
function art(day: string, source: string, category: Category): Article {
  n += 1;
  return { id: `h${n}`, title: `T${n}`, url: `https://e.com/${n}`, source, category, publishedAt: `${day}T08:00:00Z` };
}

const articles = [
  art('2026-11-23', 'Alpha', 'ai'),
  art('2026-11-23', 'Alpha', 'ai'),
  art('2026-11-23', 'Beta', 'tooling'),
  art('2026-11-22', 'Alpha', 'engineering'),
  art('2026-11-20', 'Gamma', 'ai'),
];
const NOW = Date.parse('2026-11-23T12:00:00Z');

function renderHero(over: Partial<React.ComponentProps<typeof HeroBento>> = {}) {
  const onSelectCategory = jest.fn();
  render(
    <HeroBento
      stats={computeStats(articles, '2026-11-23')}
      isLoading={false}
      updatedAt="2026-11-23T09:00:00Z"
      onSelectCategory={onSelectCategory}
      now={NOW}
      {...over}
    />,
  );
  return { onSelectCategory };
}

describe('HeroBento', () => {
  it('renders the hero tile with the computed source count and freshness', () => {
    renderHero();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('The signal in QA, AI and engineering, ranked every morning.');
    expect(screen.getByText(/Daily brief · 23 November 2026/)).toBeInTheDocument();
    expect(
      screen.getByText((_, el) => el?.tagName === 'P' && /from 3 sources/.test(el.textContent ?? '')),
    ).toBeInTheDocument(); // Alpha, Beta, Gamma
    expect(screen.getByText('updated 3h ago')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /top picks/i })).toHaveAttribute('href', '#picks');
    expect(screen.getByRole('link', { name: 'Browse the feed' })).toHaveAttribute('href', '#feed');
  });

  it('shows the published-today count and a 14-day sparkline from the data', () => {
    renderHero();
    expect(screen.getByText('Published today')).toBeInTheDocument();
    expect(screen.getByTestId('today-count')).toHaveTextContent('3');
    const spark = screen.getByRole('img', { name: /last 14 days/ });
    expect(spark.querySelectorAll('b')).toHaveLength(14);
    expect(spark.getAttribute('aria-label')).toContain('3'); // today is last
  });

  it('labels the tile with the latest day when the data is not from today', () => {
    renderHero({ now: Date.parse('2026-11-24T12:00:00Z') });
    expect(screen.getByText(/Latest day · 23 Nov/)).toBeInTheDocument();
  });

  it('lists the top 3 sources with counts and share', () => {
    renderHero();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Alpha');
    expect(items[0]).toHaveTextContent('3');
    expect(items[0]).toHaveTextContent('60%');
    expect(items[1]).toHaveTextContent('Beta');
    expect(screen.getByText('5 articles')).toBeInTheDocument();
  });

  it('renders category coverage bars; clicking filters, clicking again clears', () => {
    const { onSelectCategory } = renderHero({ activeCategory: undefined });
    const ai = screen.getByRole('button', { name: /^AI: 3 articles/ });
    expect(ai).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(ai);
    expect(onSelectCategory).toHaveBeenCalledWith('ai');
  });

  it('marks the active category pressed and clears it on click', () => {
    const { onSelectCategory } = renderHero({ activeCategory: 'ai' });
    const ai = screen.getByRole('button', { name: /^AI: 3 articles/ });
    expect(ai).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(ai);
    expect(onSelectCategory).toHaveBeenCalledWith(null);
  });

  it('keeps a static aria-label; aria-pressed carries the state', () => {
    renderHero({ activeCategory: 'ai' });
    const ai = screen.getByRole('button', { name: 'AI: 3 articles in the last 30 days' });
    expect(ai).toHaveAttribute('aria-pressed', 'true');
    expect(ai.getAttribute('aria-label')).not.toMatch(/filter/i);
  });

  it('disables bars with no articles on the feed day and does not filter', () => {
    const { onSelectCategory } = renderHero();
    // engineering has 1 article in 30 days (22nd) but none on the feed day (23rd)
    const eng = screen.getByRole('button', { name: /^Engineering: 1 articles/ });
    expect(eng).toHaveAttribute('aria-disabled', 'true');
    expect(eng).toHaveAttribute('title', 'No articles on this day');
    expect(eng).toHaveAccessibleDescription(/No articles on this day/);
    fireEvent.click(eng);
    expect(onSelectCategory).not.toHaveBeenCalled();
    // a bar with articles today stays enabled and says how many
    const ai = screen.getByRole('button', { name: /^AI: 3 articles/ });
    expect(ai).not.toHaveAttribute('aria-disabled');
    expect(ai).toHaveAccessibleDescription(/2 on this day/);
  });

  it('keeps an active bar clickable even with nothing on the feed day, so the filter can be cleared', () => {
    const { onSelectCategory } = renderHero({ activeCategory: 'engineering' });
    const eng = screen.getByRole('button', { name: /^Engineering: 1 articles/ });
    expect(eng).not.toHaveAttribute('aria-disabled');
    fireEvent.click(eng);
    expect(onSelectCategory).toHaveBeenCalledWith(null);
  });

  it('labels the delta against the 13-day average and hides decorative dots', () => {
    const { container } = render(
      <HeroBento
        stats={computeStats(articles, '2026-11-23')}
        isLoading={false}
        updatedAt={null}
        onSelectCategory={jest.fn()}
        now={NOW}
      />,
    );
    expect(screen.getByText(/vs 13-day avg/)).toBeInTheDocument();
    expect(screen.queryByText(/14-day avg/)).not.toBeInTheDocument();
    const dots = container.querySelectorAll('.dot');
    expect(dots.length).toBeGreaterThan(0);
    dots.forEach((d) => expect(d).toHaveAttribute('aria-hidden', 'true'));
    expect(container.querySelector('.srclist')).toHaveAttribute('role', 'list');
  });

  it('shows skeletons instead of numbers while loading', () => {
    const { container } = render(
      <HeroBento stats={null} isLoading updatedAt={null} onSelectCategory={jest.fn()} now={NOW} />,
    );
    expect(container.querySelectorAll('.tile-skel')).toHaveLength(3);
    expect(screen.queryByTestId('today-count')).not.toBeInTheDocument();
  });

  it('handles empty data without crashing', () => {
    renderHero({ stats: computeStats([], '2026-11-23') });
    expect(screen.getByTestId('today-count')).toHaveTextContent('0');
    expect(screen.getByText('No sources yet.')).toBeInTheDocument();
    expect(screen.getByText('No category data yet.')).toBeInTheDocument();
  });

  describe('live clock (no now prop)', () => {
    afterEach(() => jest.useRealTimers());

    it('reads the clock after mount and ages the updated pill every minute', () => {
      jest.useFakeTimers();
      jest.setSystemTime(Date.parse('2026-11-23T09:05:00Z'));
      render(
        <HeroBento
          stats={computeStats(articles, '2026-11-23')}
          isLoading={false}
          updatedAt="2026-11-23T09:00:00Z"
          onSelectCategory={jest.fn()}
        />,
      );
      expect(screen.getByText('updated 5m ago')).toBeInTheDocument();
      expect(screen.getByText('Published today')).toBeInTheDocument();
      act(() => {
        jest.advanceTimersByTime(60_000);
      });
      expect(screen.getByText('updated 6m ago')).toBeInTheDocument();
    });

    it('clears the interval on unmount', () => {
      jest.useFakeTimers();
      jest.setSystemTime(Date.parse('2026-11-23T09:05:00Z'));
      const { unmount } = render(
        <HeroBento stats={null} isLoading updatedAt={null} onSelectCategory={jest.fn()} />,
      );
      expect(jest.getTimerCount()).toBeGreaterThan(0);
      unmount();
      expect(jest.getTimerCount()).toBe(0);
    });
  });
});
