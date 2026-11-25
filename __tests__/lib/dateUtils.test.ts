import { getUTCToday, getYesterdayUTC, getNextRefreshTime, getArticlesForDate, isDayBeforeRefreshTime, formatTimeInBothZones, getNextRefreshTimeWithZones, REFRESH_HOUR_UTC, formatRefreshHourUTC, getWarsawZoneLabel } from '@/lib/dateUtils';
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

  describe('refresh time (03:00 UTC), deterministic', () => {
    const at = (iso: string) => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(iso));
    };
    afterEach(() => jest.useRealTimers());

    it('REFRESH_HOUR_UTC is 3', () => {
      expect(REFRESH_HOUR_UTC).toBe(3);
      expect(formatRefreshHourUTC()).toBe('03:00 UTC');
    });

    it('before 03:00 counts down to same day', () => {
      at('2026-08-04T01:30:00Z');
      expect(getNextRefreshTime()).toEqual({ minutesUntil: 90, timeString: '1h 30m' });
    });

    it('exactly 03:00 is 0 minutes (refresh is now)', () => {
      at('2026-08-04T03:00:00Z');
      expect(getNextRefreshTime()).toEqual({ minutesUntil: 0, timeString: '0m' });
    });

    it('after 03:00 counts down to next day', () => {
      at('2026-08-04T04:15:00Z');
      expect(getNextRefreshTime()).toEqual({ minutesUntil: 22 * 60 + 45, timeString: '22h 45m' });
    });

    it('rolls over month end', () => {
      at('2026-08-31T20:00:00Z');
      expect(getNextRefreshTime().minutesUntil).toBe(7 * 60);
    });

    it('rolls over year end', () => {
      at('2026-12-31T23:00:00Z');
      expect(getNextRefreshTime()).toEqual({ minutesUntil: 4 * 60, timeString: '4h 0m' });
    });

    it('isDayBeforeRefreshTime boundaries', () => {
      at('2026-08-04T00:00:00Z');
      expect(isDayBeforeRefreshTime()).toBe(true);
      at('2026-08-04T02:59:00Z');
      expect(isDayBeforeRefreshTime()).toBe(true);
      at('2026-08-04T03:00:00Z');
      expect(isDayBeforeRefreshTime()).toBe(false);
      at('2026-08-04T23:59:00Z');
      expect(isDayBeforeRefreshTime()).toBe(false);
    });

    it('Warsaw display in summer (CEST, GMT+2)', () => {
      at('2026-08-04T01:00:00Z');
      expect(getNextRefreshTimeWithZones().displayString).toBe('daily ~05:00 GMT+2');
    });

    it('Warsaw display in winter (CET, GMT+1)', () => {
      at('2026-12-10T01:00:00Z');
      expect(getNextRefreshTimeWithZones().displayString).toBe('daily ~04:00 GMT+1');
    });

    it('DST day: spring forward 2026-03-29 (refresh 03:00Z = 05:00 CEST)', () => {
      at('2026-03-28T01:00:00Z');
      expect(getNextRefreshTimeWithZones().displayString).toBe('daily ~04:00 GMT+1');
      at('2026-03-28T20:00:00Z'); // next refresh is on the DST day itself
      expect(getNextRefreshTimeWithZones().displayString).toBe('daily ~05:00 GMT+2');
      at('2026-03-29T02:00:00Z'); // after the 01:00Z switch, before the refresh
      expect(getNextRefreshTimeWithZones().displayString).toBe('daily ~05:00 GMT+2');
    });

    it('DST day: fall back 2026-10-25 (refresh 03:00Z = 04:00 CET)', () => {
      at('2026-10-24T01:00:00Z');
      expect(getNextRefreshTimeWithZones().displayString).toBe('daily ~05:00 GMT+2');
      at('2026-10-24T20:00:00Z'); // next refresh is on the DST day itself
      expect(getNextRefreshTimeWithZones().displayString).toBe('daily ~04:00 GMT+1');
      at('2026-10-25T02:00:00Z'); // after the 01:00Z switch, before the refresh
      expect(getNextRefreshTimeWithZones().displayString).toBe('daily ~04:00 GMT+1');
    });

    it('formatTimeInBothZones and zone label respect DST', () => {
      expect(formatTimeInBothZones('2026-12-10T06:00:00Z')).toBe('07:00');
      expect(getWarsawZoneLabel('2026-12-10T06:00:00Z')).toBe('GMT+1');
      expect(getWarsawZoneLabel('2026-08-04T06:00:00Z')).toBe('GMT+2');
    });
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
    expect(result.displayString).toMatch(/^daily ~\d{2}:\d{2} GMT\+[12]$/);
  });
});
