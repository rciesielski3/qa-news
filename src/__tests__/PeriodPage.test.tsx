import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import PeriodPage from '@/components/PeriodPage';
import PageShell from '@/components/PageShell';

let search = '';
let params: URLSearchParams | null = null;
let pathname = '/weekly/';
jest.mock('next/navigation', () => ({
  useSearchParams: () => params ?? (params = new URLSearchParams(search)),
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => pathname,
}));

const DAY = 24 * 60 * 60 * 1000;
function daysAgo(n: number): string {
  return new Date(Date.now() - n * DAY).toISOString();
}
function article(id: string, ago: number, over: Record<string, unknown> = {}) {
  return {
    id,
    title: `Title ${id}`,
    url: `https://example.com/${id}`,
    source: 'Alpha',
    category: 'ai',
    publishedAt: daysAgo(ago),
    score: 50,
    ...over,
  };
}

// 5 within the last week, 3 more only within the month, 1 older than a month.
const data = [
  article('w1', 0, { score: 90, source: 'Alpha' }),
  article('w2', 1, { score: 80, source: 'Alpha' }),
  article('w3', 2, { score: 70, source: 'Beta', category: 'tooling' }),
  article('w4', 3, { score: 60, source: 'Beta', category: 'tooling' }),
  article('w5', 5, { score: 55, source: 'Gamma' }),
  article('m1', 12, { score: 99, source: 'Delta' }),
  article('m2', 20, { score: 40, source: 'Delta' }),
  article('m3', 25, { score: 30, source: 'Delta' }),
  article('old', 60, { score: 100, source: 'Zeta' }),
];

beforeEach(() => {
  search = '';
  params = null;
  window.innerHeight = 768;
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({ updatedAt: new Date().toISOString(), articles: data }),
  })) as unknown as typeof fetch;
});

describe('PeriodPage', () => {
  it('weekly: hero stats come from the last 7 days only', async () => {
    render(<PeriodPage period="week" />);
    await waitFor(() => expect(screen.getByTestId('period-count')).toHaveTextContent('5'));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('The week in QA, ranked.');
    expect(screen.getByText(/Weekly brief/)).toBeInTheDocument();
    // 3 distinct sources in the week (Alpha, Beta, Gamma): shown in the hero copy
    expect(screen.getByText(/from/).textContent).toContain('3');
    const spark = screen.getByRole('img', { name: /Articles per day, last 7 days/ });
    expect(spark).toBeInTheDocument();
    expect(screen.queryByText('Delta')).not.toBeInTheDocument();
    expect(screen.getByText(/0\.7 per day/)).toBeInTheDocument();
  });

  it('monthly: window is 30 days', async () => {
    render(<PeriodPage period="month" />);
    await waitFor(() => expect(screen.getByTestId('period-count')).toHaveTextContent('8'));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('The month in QA, ranked.');
    expect(screen.getByRole('img', { name: /Articles per day, last 30 days/ })).toBeInTheDocument();
    expect(screen.getAllByText('Delta').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: "This Month's Top Picks" })).toBeInTheDocument();
  });

  it('renders top picks (best score of the window, #1 featured), feed and section nav links', async () => {
    const { container } = render(<PeriodPage period="month" />);
    await waitFor(() => expect(container.querySelectorAll('.pickcard h3')).toHaveLength(3));
    const picks = Array.from(container.querySelectorAll('.pickcard h3')).map((h) => h.textContent);
    // 'old' (score 100) is outside the window and must not be picked
    expect(picks).toEqual(['Title m1', 'Title w1', 'Title w2']);

    const nav = screen.getByRole('navigation', { name: 'Sections' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['#picks', '#feed']);
    // feed excludes the picks
    await waitFor(() => expect(container.querySelectorAll('.feed-row').length).toBe(5));
    expect(container.querySelector('section#picks')).toBeInTheDocument();
    expect(container.querySelector('section#feed.band')).toBeInTheDocument();
    expect(screen.getByText('02', { selector: '.sec-no' })).toBeInTheDocument();
  });

  it('shows skeletons while loading and the empty state without data', async () => {
    let resolve: () => void = () => {};
    const gate = new Promise<void>((r) => {
      resolve = r;
    });
    global.fetch = jest.fn(async () => {
      await gate;
      return { ok: true, json: async () => ({ articles: [] }) };
    }) as unknown as typeof fetch;
    const { container } = render(<PeriodPage period="week" />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    resolve();
    await screen.findByText('No articles match these filters');
    expect(screen.getByText('No top picks this week.')).toBeInTheDocument();
    expect(screen.queryByTestId('period-count')).toBeInTheDocument();
    expect(screen.getByTestId('period-count')).toHaveTextContent('0');
  });

  it('category filter from the URL narrows the feed; reset is offered; hero bars toggle the filter', async () => {
    search = 'category=tooling';
    const { container } = render(<PeriodPage period="week" />);
    await waitFor(() => expect(container.querySelectorAll('.pickcard h3')).toHaveLength(3));
    // week: 2 tooling articles, both are not top picks? picks are w1,w2,w3 -> only w4 remains in the feed
    await waitFor(() => expect(container.querySelectorAll('.feed-row')).toHaveLength(1));
    const bar = screen.getByRole('button', { pressed: true, name: /Tooling.*2 articles/ });
    expect(bar).toBeInTheDocument();
    fireEvent.click(bar);
  });

  it('has exactly one h1 and a slim header with range and sibling link', async () => {
    const { container } = render(<PeriodPage period="week" />);
    await waitFor(() => expect(screen.getByTestId('period-count')).toHaveTextContent('5'));
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const header = container.querySelector('header.period-head') as HTMLElement;
    expect(header).toBeInTheDocument();
    expect(header.querySelector('h1')).toBeInTheDocument();
    expect(header.querySelector('.eyebrow')?.textContent).toMatch(/Weekly brief · \d{1,2} \w{3} – \d{1,2} \w{3}/);
    expect(within(header).getByRole('link', { name: /Monthly brief/ })).toHaveAttribute('href', '/monthly');
    expect(container.querySelector('.t-head')).not.toBeInTheDocument();
  });

  it('renders three stat tiles in order, fed by computePeriodStats', async () => {
    const { container } = render(<PeriodPage period="month" />);
    await waitFor(() => expect(screen.getByTestId('period-count')).toHaveTextContent('8'));
    const tiles = Array.from(container.querySelectorAll('.period-stats > .tile'));
    expect(tiles).toHaveLength(3);
    expect(tiles[0]).toHaveTextContent(/Published this month/);
    expect(tiles[0]).toHaveTextContent('8');
    expect(tiles[0]).toHaveTextContent(/0\.3 per day|per day/);
    expect(tiles[1]).toHaveTextContent('Top sources');
    expect(tiles[1]).toHaveTextContent('Delta');
    expect(tiles[2]).toHaveTextContent(/Coverage by category/);
    expect(within(tiles[2] as HTMLElement).getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('links to the sibling period page', async () => {
    render(<PeriodPage period="week" />);
    expect(screen.getByRole('link', { name: 'Monthly brief' })).toHaveAttribute('href', '/monthly');
  });
});

describe('PageShell full-bleed routes', () => {
  it.each([
    ['/', false],
    ['/weekly/', false],
    ['/weekly', false],
    ['/monthly/', false],
    ['/other/', true],
  ])('%s narrow container: %s', (path, narrow) => {
    pathname = path;
    const { container } = render(
      <PageShell>
        <span>x</span>
      </PageShell>,
    );
    expect(!!container.querySelector('.container')).toBe(narrow);
  });
});
