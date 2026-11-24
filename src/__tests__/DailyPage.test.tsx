import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DailyPage from '@/app/page';

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
