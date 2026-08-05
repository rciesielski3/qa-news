import { getUTCToday, getYesterdayUTC, getNextRefreshTime, getArticlesForDate, isDayBeforeRefreshTime, formatTimeInBothZones, getNextRefreshTimeWithZones } from '@/lib/dateUtils';
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
    const today = getUTCToday();
    const yesterday = getYesterdayUTC();

    // Create dates relative to today
    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];

    const articles: Article[] = [
      { id: '1', title: 'Today morning', publishedAt: `${todayString}T10:00:00Z`, category: 'ai', url: '', source: '' },
      { id: '2', title: 'Yesterday', publishedAt: `${yesterdayString}T10:00:00Z`, category: 'ai', url: '', source: '' },
      { id: '3', title: 'Today afternoon', publishedAt: `${todayString}T14:00:00Z`, category: 'ai', url: '', source: '' },
    ];
    const todayArticles = getArticlesForDate(articles, today);
    expect(todayArticles).toHaveLength(2);
    expect(todayArticles.map(a => a.id)).toContain('1');
    expect(todayArticles.map(a => a.id)).toContain('3');
  });

  it('isDayBeforeRefreshTime correctly identifies time windows', () => {
    const result = isDayBeforeRefreshTime();
    expect(typeof result).toBe('boolean');

    // Validate logic: returns true before 05:00 UTC, false after
    const now = new Date();
    const isBeforeFive = now.getUTCHours() < 5;
    expect(result).toBe(isBeforeFive);
  });

  it('formatTimeInBothZones formats ISO string in Warsaw time', () => {
    const isoString = '2026-08-04T06:53:39.869Z';
    const result = formatTimeInBothZones(isoString);

    expect(result).toMatch(/\d{2}:\d{2}/);
    expect(result).toBe('08:53');
  });

  it('formatTimeInBothZones handles midnight correctly', () => {
    const isoString = '2026-08-04T02:00:00.000Z';
    const result = formatTimeInBothZones(isoString);

    expect(result).toBe('04:00');
  });

  it('formatTimeInBothZones handles edge case near UTC midnight', () => {
    const isoString = '2026-08-04T23:30:00.000Z';
    const result = formatTimeInBothZones(isoString);

    expect(result).toMatch(/\d{2}:\d{2}/);
    expect(result).toBe('01:30');
  });

  it('getNextRefreshTimeWithZones returns refresh info with display string', () => {
    const result = getNextRefreshTimeWithZones();
    expect(result).toHaveProperty('minutesUntil');
    expect(result).toHaveProperty('timeString');
    expect(result).toHaveProperty('displayString');
    expect(result.displayString).toContain('GMT+2');
    expect(result.displayString).toMatch(/at \d{2}:\d{2} GMT\+2/);
  });
});
