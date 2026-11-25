import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DailyPage from '@/app/page';
import { formatRefreshHourUTC } from '@/lib/dateUtils';

let search = '';
let params: URLSearchParams | null = null;
jest.mock('next/navigation', () => ({
  // Like Next, return a stable object between renders
  useSearchParams: () => params ?? (params = new URLSearchParams(search)),
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}));

function article(i: number, category: string) {
  return {
    id: `p${i}`,
    title: `Page article ${i}`,
    url: `https://example.com/${i}`,
    source: 'Src',
    category,
    publishedAt: new Date().toISOString(),
    score: 100 - i,
  };
}

const articles = [
  ...Array.from({ length: 30 }, (_, i) => article(i, 'ai')),
  article(99, 'tooling'),
];

let resolveTrending: () => void = () => {};

beforeEach(() => {
  search = 'category=ai';
  params = null;
  window.innerHeight = 768;
  const trendingGate = new Promise<void>((res) => {
    resolveTrending = res;
  });
  global.fetch = jest.fn(async (url: string) => {
    if (url === '/trending.json') {
      await trendingGate;
      return {
        ok: true,
        json: async () => ({
          items: [{ title: 'org/repo', url: 'https://github.com/org/repo', category: 'tooling', stars: 5 }],
        }),
      };
    }
    return { ok: true, json: async () => ({ updatedAt: new Date().toISOString(), articles }) };
  }) as unknown as typeof fetch;
});

function mockLatest(updatedAt: string | null, list: unknown[]) {
  global.fetch = jest.fn(async (url: string) => {
    if (url === '/trending.json') return { ok: true, json: async () => ({ items: [] }) };
    return { ok: true, json: async () => ({ ...(updatedAt ? { updatedAt } : {}), articles: list }) };
  }) as unknown as typeof fetch;
}

describe('Daily page headings and stale notice', () => {
  beforeEach(() => {
    search = '';
    params = null;
  });
  afterEach(() => jest.useRealTimers());

  it('describes the 24 hour window instead of "today"', async () => {
    mockLatest(new Date().toISOString(), articles.slice(0, 3));
    render(<DailyPage />);
    expect(await screen.findByRole('heading', { name: 'Top Picks of the Last 24 Hours' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'All Articles from the Last 24 Hours' })).toBeInTheDocument();
    expect(screen.getByText(/best-scored stories of the last 24 hours/)).toBeInTheDocument();
    expect(screen.queryByText(/Today's/)).not.toBeInTheDocument();
  });

  it('shows no stale notice when the update is fresh or 30 hours old', async () => {
    const now = Date.parse('2026-11-25T12:00:00Z');
    jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate', 'setTimeout', 'setInterval', 'queueMicrotask'] });
    jest.setSystemTime(now);
    mockLatest(new Date(now - 30 * 3600 * 1000).toISOString(), articles.slice(0, 3));
    render(<DailyPage />);
    await screen.findByRole('heading', { name: 'Top Picks of the Last 24 Hours' });
    expect(screen.queryByText(/The latest update is/)).not.toBeInTheDocument();
  });

  it('shows the stale notice with the refresh hour only when the update is older than 30 hours', async () => {
    const now = Date.parse('2026-11-25T12:00:00Z');
    jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate', 'setTimeout', 'setInterval', 'queueMicrotask'] });
    jest.setSystemTime(now);
    mockLatest(new Date(now - 31.5 * 3600 * 1000).toISOString(), []);
    render(<DailyPage />);
    const notice = await screen.findByText(/The latest update is 31 hours old\./);
    expect(notice).toHaveTextContent(`The next refresh is expected around ${formatRefreshHourUTC()}.`);
  });

  it('shows no stale notice without updatedAt', async () => {
    mockLatest(null, articles.slice(0, 3));
    render(<DailyPage />);
    await screen.findByRole('heading', { name: 'Top Picks of the Last 24 Hours' });
    expect(screen.queryByText(/The latest update is/)).not.toBeInTheDocument();
  });
});

describe('Daily page', () => {
  it('keeps Load More progress when trending.json resolves later', async () => {
    const { container } = render(<DailyPage />);
    await screen.findByText('Load More');
    const rows = () => container.querySelectorAll('.feed-row').length;
    const initial = rows();
    fireEvent.click(screen.getByText('Load More'));
    await waitFor(() => expect(rows()).toBeGreaterThan(initial));
    const afterLoadMore = rows();

    await act(async () => {
      resolveTrending();
    });
    await screen.findByText('New & notable repos');
    expect(rows()).toBe(afterLoadMore);
  });
});
