import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrendingRepos, { formatStars, truncate, MAX_TRENDING_REPOS } from '@/components/TrendingRepos';

function repo(i: number, overrides: Record<string, unknown> = {}) {
  return {
    title: `acme/repo-${i}`,
    url: `https://github.com/acme/repo-${i}`,
    summary: `Repo ${i} summary`,
    description: `Repo ${i} description`,
    stars: 100 + i,
    category: i % 2 === 0 ? 'test-automation' : 'ai',
    publishedAt: '2026-11-01T10:00:00Z',
    ...overrides,
  };
}

function mockFetch(impl: () => Promise<unknown>) {
  global.fetch = jest.fn(impl) as unknown as typeof fetch;
}

function mockJson(body: unknown, ok = true) {
  mockFetch(async () => ({ ok, json: async () => body }));
}

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

describe('TrendingRepos', () => {
  it('renders repos with link, stars and description', async () => {
    mockJson({ generatedAt: '2026-11-18T08:00:00Z', items: [repo(1, { stars: 1520 })] });
    render(<TrendingRepos />);

    const link = await screen.findByRole('link', { name: 'acme/repo-1 (opens in new tab)' });
    expect(link).toHaveAttribute('href', 'https://github.com/acme/repo-1');
    expect(link).toHaveAttribute('target', '_blank');
    expect(screen.getByText('New & notable repos')).toBeInTheDocument();
    expect(screen.getByText('QA and AI-testing repos created in the last 60 days')).toBeInTheDocument();
    expect(screen.getByText('★ 1.5k')).toBeInTheDocument();
    expect(screen.getByText('Repo 1 description')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith('/trending.json');
  });

  it('caps the list at 6 repos', async () => {
    mockJson({ items: Array.from({ length: 10 }, (_, i) => repo(i)) });
    render(<TrendingRepos />);

    await screen.findByText('New & notable repos');
    expect(screen.getAllByRole('listitem')).toHaveLength(MAX_TRENDING_REPOS);
    expect(MAX_TRENDING_REPOS).toBe(6);
    expect(screen.queryByText('acme/repo-6')).not.toBeInTheDocument();
  });

  it('falls back to summary when description is missing', async () => {
    mockJson({ items: [repo(2, { description: undefined })] });
    render(<TrendingRepos />);
    expect(await screen.findByText('Repo 2 summary')).toBeInTheDocument();
  });

  it('renders nothing when the list is empty', async () => {
    mockJson({ items: [] });
    const { container } = render(<TrendingRepos />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when trending.json is missing (HTTP 404)', async () => {
    mockJson({}, false);
    const { container } = render(<TrendingRepos />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when the fetch fails', async () => {
    mockFetch(async () => {
      throw new Error('network down');
    });
    const { container } = render(<TrendingRepos />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for a malformed payload and skips malformed items', async () => {
    mockJson({ items: 'nope' });
    const { container, unmount } = render(<TrendingRepos />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
    unmount();

    mockJson({ items: [{ title: 42 }, repo(3)] });
    render(<TrendingRepos />);
    await screen.findByRole('link', { name: 'acme/repo-3 (opens in new tab)' });
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});

describe('formatStars', () => {
  it('formats counts', () => {
    expect(formatStars(948)).toBe('948');
    expect(formatStars(1000)).toBe('1k');
    expect(formatStars(12345)).toBe('12.3k');
  });
});

describe('truncate', () => {
  it('keeps short text and shortens long text with an ellipsis', () => {
    expect(truncate('short  text')).toBe('short text');
    const result = truncate('a'.repeat(200), 20);
    expect(result).toHaveLength(20);
    expect(result.endsWith('…')).toBe(true);
  });
});
