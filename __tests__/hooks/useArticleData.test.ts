import { renderHook, waitFor } from '@testing-library/react';
import { useArticleData } from '@/hooks/useArticleData';

describe('useArticleData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns articles and loading state', async () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Test Article',
        url: 'https://example.com',
        source: 'Test',
        category: 'ai' as const,
        publishedAt: new Date().toISOString(),
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ articles: mockArticles }),
      } as Response),
    );

    const { result } = renderHook(() => useArticleData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.articles)).toBe(true);
  });

  it('includes isUsingFallback flag', async () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Test Article',
        url: 'https://example.com',
        source: 'Test',
        category: 'ai' as const,
        publishedAt: new Date().toISOString(),
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ articles: mockArticles }),
      } as Response),
    );

    const { result } = renderHook(() => useArticleData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.isUsingFallback).toBe('boolean');
  });
});
