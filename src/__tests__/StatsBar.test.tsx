import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsBar from '@/components/StatsBar';

let pathname = '/';
jest.mock('next/navigation', () => ({ usePathname: () => pathname }));

beforeEach(() => {
  global.fetch = jest.fn(async () => ({
    json: async () => ({ updatedAt: '2026-11-23T09:00:00Z', articles: [] }),
  })) as unknown as typeof fetch;
});

describe('StatsBar', () => {
  it('does not fetch latest.json on the Daily page (the hero already does)', () => {
    pathname = '/';
    const { container } = render(<StatsBar />);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(container).toBeEmptyDOMElement();
  });

  it('fetches and renders on inner pages', async () => {
    pathname = '/about';
    render(<StatsBar />);
    expect(global.fetch).toHaveBeenCalledWith('/latest.json');
    await waitFor(() => expect(screen.getByText(/next refresh/)).toBeInTheDocument());
  });
});
