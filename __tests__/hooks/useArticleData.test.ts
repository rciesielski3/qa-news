import { renderHook, waitFor } from '@testing-library/react';
import { useArticleData } from '@/hooks/useArticleData';
import { computeDailyWindow, staleHours } from '@/lib/dailyWindow';
import type { Article } from '@/lib/types';

let n = 0;
function art(publishedAt: string, over: Partial<Article> = {}): Article {
  n += 1;
  return {
    id: `w${n}`,
    title: `W${n}`,
    url: `https://example.com/w${n}`,
    source: 'Src',
    category: 'ai',
    publishedAt,
    ...over,
  };
}

const UPDATED = '2026-11-25T06:30:00.000Z';
const ids = (list: Article[]) => list.map((a) => a.id);

describe('computeDailyWindow', () => {
  it('keeps articles up to the end instant and drops older than 24h', () => {
    const inside = art('2026-11-24T06:30:01Z');
    const atEnd = art(UPDATED);
    const oneHour = art('2026-11-25T05:30:00Z');
    const old = art('2026-11-24T06:29:59Z');
    const w = computeDailyWindow([inside, atEnd, oneHour, old], UPDATED);
    expect(ids(w.articles).sort()).toEqual(ids([inside, atEnd, oneHour]).sort());
    expect(w.endMs).toBe(Date.parse(UPDATED));
    expect(w.startMs).toBe(Date.parse(UPDATED) - 24 * 3600 * 1000);
    expect(w.anchoredToUpdate).toBe(true);
  });

  it('excludes an article exactly 24h before the end (start is exclusive) and includes one exactly at the end', () => {
    const exactlyStart = art('2026-11-24T06:30:00Z');
    const atEnd = art(UPDATED);
    expect(ids(computeDailyWindow([exactlyStart, atEnd], UPDATED).articles)).toEqual([atEnd.id]);
  });

  it('excludes articles newer than updatedAt', () => {
    const newer = art('2026-11-25T06:30:01Z');
    const ok = art('2026-11-25T01:00:00Z');
    expect(ids(computeDailyWindow([newer, ok], UPDATED).articles)).toEqual([ok.id]);
  });

  it.each([[undefined], [null], ['not-a-date'], ['']])('ends the window at the newest article when updatedAt is %p', (bad) => {
    const newest = art('2026-11-25T02:00:00Z');
    const prev = art('2026-11-24T03:00:00Z'); // within 24h of newest
    const old = art('2026-11-24T01:00:00Z'); // older than 24h before newest
    const w = computeDailyWindow([prev, newest, old], bad as string | null | undefined);
    expect(ids(w.articles)).toEqual([prev.id, newest.id]);
    expect(w.endMs).toBe(Date.parse('2026-11-25T02:00:00Z'));
    expect(w.anchoredToUpdate).toBe(false);
  });

  it('uses the 24h before the newest article when the window is empty', () => {
    const newest = art('2026-11-20T12:00:00Z');
    const prev = art('2026-11-19T18:00:00Z');
    const old = art('2026-11-18T12:00:00Z');
    const w = computeDailyWindow([prev, newest, old], UPDATED);
    expect(ids(w.articles)).toEqual([prev.id, newest.id]);
    expect(w.endMs).toBe(Date.parse('2026-11-20T12:00:00Z'));
    expect(w.anchoredToUpdate).toBe(false);
  });

  it('handles empty data, with and without updatedAt', () => {
    expect(computeDailyWindow([], null)).toEqual({ articles: [], startMs: null, endMs: null, anchoredToUpdate: false });
    const w = computeDailyWindow([], UPDATED);
    expect(w.articles).toEqual([]);
    expect(w.endMs).toBe(Date.parse(UPDATED));
  });

  it('ignores articles with unreadable dates', () => {
    const ok = art('2026-11-25T01:00:00Z');
    expect(ids(computeDailyWindow([art('nope'), ok], UPDATED).articles)).toEqual([ok.id]);
  });
});

describe('staleHours', () => {
  const updated = Date.parse(UPDATED);
  it('is null up to and including 30 hours, then whole hours', () => {
    expect(staleHours(UPDATED, updated + 30 * 3600 * 1000)).toBeNull();
    expect(staleHours(UPDATED, updated + 30 * 3600 * 1000 + 1)).toBe(30);
    expect(staleHours(UPDATED, updated + 49.9 * 3600 * 1000)).toBe(49);
  });
  it('is null without a readable updatedAt or clock', () => {
    expect(staleHours(null, updated)).toBeNull();
    expect(staleHours('x', updated)).toBeNull();
    expect(staleHours(UPDATED, null)).toBeNull();
  });
});

describe('useArticleData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockFetch(body: unknown) {
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve(body) } as Response));
  }

  it('returns the 24h window ending at updatedAt, all articles and the loading state', async () => {
    const inside = art('2026-11-25T01:00:00Z');
    const old = art('2026-11-20T01:00:00Z');
    mockFetch({ articles: [inside, old], updatedAt: UPDATED });

    const { result } = renderHook(() => useArticleData());
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(ids(result.current.articles)).toEqual([inside.id]);
    expect(result.current.allArticles).toHaveLength(2);
    expect(result.current.updatedAt).toBe(UPDATED);
    expect(result.current.window?.endMs).toBe(Date.parse(UPDATED));
  });

  it('falls back to the newest article when updatedAt is missing', async () => {
    const a = art('2026-11-25T01:00:00Z');
    mockFetch({ articles: [a] });
    const { result } = renderHook(() => useArticleData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(ids(result.current.articles)).toEqual([a.id]);
    expect(result.current.updatedAt).toBeNull();
  });

  it('handles empty data and failed fetches', async () => {
    mockFetch({ articles: [] });
    const empty = renderHook(() => useArticleData());
    await waitFor(() => expect(empty.result.current.isLoading).toBe(false));
    expect(empty.result.current.articles).toEqual([]);
    expect(empty.result.current.window?.endMs).toBeNull();

    global.fetch = jest.fn(() => Promise.reject(new Error('offline')));
    const failed = renderHook(() => useArticleData());
    await waitFor(() => expect(failed.result.current.isLoading).toBe(false));
    expect(failed.result.current.articles).toEqual([]);
    expect(failed.result.current.window).toBeNull();
  });
});
