import { getUTCToday, getYesterdayUTC, getNextRefreshTime, getArticlesForDate, isDayBeforeRefreshTime } from '@/lib/dateUtils';
import type { Article } from '@/lib/types';

describe('dateUtils', () => {
  it('getUTCToday returns today at 00:00:00 UTC', () => {
    const today = getUTCToday();
    expect(today.getUTCHours()).toBe(0);
    expect(today.getUTCMinutes()).toBe(0);
    expect(today.getUTCSeconds()).toBe(0);
  });

  it('getYesterdayUTC returns yesterday at 00:00:00 UTC', () => {
    const today = getUTCToday();
    const yesterday = getYesterdayUTC();
    const diff = (today.getTime() - yesterday.getTime()) / (1000 * 60 * 60 * 24);
    expect(diff).toBe(1);
  });

  it('getNextRefreshTime returns object with minutesUntil and timeString', () => {
    const refresh = getNextRefreshTime();
    expect(refresh).toHaveProperty('minutesUntil');
    expect(refresh).toHaveProperty('timeString');
    expect(typeof refresh.minutesUntil).toBe('number');
    expect(typeof refresh.timeString).toBe('string');
    expect(refresh.minutesUntil).toBeGreaterThanOrEqual(0);
    expect(refresh.minutesUntil).toBeLessThan(24 * 60);
  });

  it('getArticlesForDate filters articles by date', () => {
    const articles: Article[] = [
      { id: '1', title: 'Today', publishedAt: '2026-07-17T10:00:00Z', category: 'ai', url: '', source: '' },
      { id: '2', title: 'Yesterday', publishedAt: '2026-07-16T10:00:00Z', category: 'ai', url: '', source: '' },
      { id: '3', title: 'Also Today', publishedAt: '2026-07-17T14:00:00Z', category: 'ai', url: '', source: '' },
    ];
    const today = getUTCToday();
    const todayArticles = getArticlesForDate(articles, today);
    expect(todayArticles).toHaveLength(2);
    expect(todayArticles.map(a => a.id)).toContain('1');
    expect(todayArticles.map(a => a.id)).toContain('3');
  });

  it('isDayBeforeRefreshTime returns boolean', () => {
    const result = isDayBeforeRefreshTime();
    expect(typeof result).toBe('boolean');
  });
});
