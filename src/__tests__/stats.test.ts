import { computeStats, computePeriodStats, formatAgo, latestArticleDay, SPARK_DAYS } from '@/lib/stats';
import type { Article, Category } from '@/lib/types';

let n = 0;
function art(day: string, over: Partial<Article> = {}): Article {
  n += 1;
  return {
    id: `a${n}`,
    title: `T${n}`,
    url: `https://example.com/${n}`,
    source: 'Alpha',
    category: 'ai' as Category,
    publishedAt: `${day}T10:00:00Z`,
    ...over,
  };
}

describe('computeStats', () => {
  it('returns zeroed stats for empty input', () => {
    const s = computeStats([], '2026-11-23');
    expect(s.total).toBe(0);
    expect(s.sourceCount).toBe(0);
    expect(s.todayCount).toBe(0);
    expect(s.spark).toEqual(new Array(SPARK_DAYS).fill(0));
    expect(s.deltaPct).toBeNull();
    expect(s.topSources).toEqual([]);
    expect(s.categories).toEqual([]);
    expect(s.refDay).toBe('2026-11-23');
  });

  it('defaults the reference day to the newest day in the data', () => {
    const s = computeStats([art('2026-11-20'), art('2026-11-22'), art('2026-11-21')]);
    expect(s.refDay).toBe('2026-11-22');
    expect(s.todayCount).toBe(1);
  });

  it('accepts a Date as reference day', () => {
    const s = computeStats([art('2026-11-22')], new Date('2026-11-22T15:00:00Z'));
    expect(s.refDay).toBe('2026-11-22');
    expect(s.todayCount).toBe(1);
  });

  it('counts only the reference day as today, using UTC days', () => {
    const s = computeStats(
      [
        art('2026-11-23'),
        art('2026-11-23', { publishedAt: '2026-11-23T23:59:59Z' }),
        art('2026-11-22', { publishedAt: '2026-11-22T23:59:59Z' }),
        art('2026-11-24'),
      ],
      '2026-11-23',
    );
    expect(s.todayCount).toBe(2);
  });

  it('builds a 14-day spark ending on the reference day, with zero days', () => {
    const s = computeStats(
      [art('2026-11-23'), art('2026-11-23'), art('2026-11-21'), art('2026-11-10'), art('2026-11-09')],
      '2026-11-23',
    );
    expect(s.spark).toHaveLength(14);
    expect(s.spark[13]).toBe(2); // 23rd
    expect(s.spark[12]).toBe(0); // 22nd
    expect(s.spark[11]).toBe(1); // 21st
    expect(s.spark[0]).toBe(1); // the 10th is index 0 (23 - 13)
    expect(s.spark[10]).toBe(0); // the 20th has no articles
    expect(s.spark.reduce((a, b) => a + b, 0)).toBe(4); // the 9th falls outside the window
  });

  it('includes the oldest spark day (ref - 13)', () => {
    const s = computeStats([art('2026-11-10')], '2026-11-23');
    expect(s.spark[0]).toBe(1);
    const out = computeStats([art('2026-11-09')], '2026-11-23');
    expect(out.spark.every((v) => v === 0)).toBe(true);
  });

  it('computes the delta against the average of the previous 13 days', () => {
    const prev = Array.from({ length: 13 }, (_, i) => art(`2026-11-${String(10 + i).padStart(2, '0')}`));
    const today = [art('2026-11-23'), art('2026-11-23')];
    const s = computeStats([...prev, ...today], '2026-11-23');
    // avg = 1, today = 2 -> +100%
    expect(s.deltaPct).toBe(100);
    const drop = computeStats(prev, '2026-11-23');
    expect(drop.deltaPct).toBe(-100);
  });

  it('excludes zero-article days from the delta baseline', () => {
    // 2 active days with 4 articles each among the previous 13 (11 empty days), today = 6
    const prev = [
      ...Array.from({ length: 4 }, () => art('2026-11-15')),
      ...Array.from({ length: 4 }, () => art('2026-11-20')),
    ];
    const today = Array.from({ length: 6 }, () => art('2026-11-23'));
    const s = computeStats([...prev, ...today], '2026-11-23');
    // avg over active days = 4 (not 8/13 = 0.6) -> +50%
    expect(s.deltaPct).toBe(50);
  });

  it('has no delta when every baseline day is empty', () => {
    expect(computeStats([art('2026-11-23')], '2026-11-23').deltaPct).toBeNull();
  });

  it('counts the reference day per category separately from the 30-day coverage', () => {
    const s = computeStats(
      [art('2026-11-23', { category: 'ai' }), art('2026-11-10', { category: 'tooling' }), art('2026-11-10', { category: 'tooling' })],
      '2026-11-23',
    );
    expect(s.todayByCategory).toEqual({ ai: 1 });
    expect(s.categories.find((c) => c.category === 'tooling')?.count).toBe(2);
  });

  it('does not throw when an article has no category', () => {
    const s = computeStats(
      [art('2026-11-23', { category: undefined as unknown as Category }), art('2026-11-23', { category: 'ai' })],
      '2026-11-23',
    );
    expect(s.categories).toHaveLength(2);
  });

  it('ranks the top 3 sources deterministically and gives their share', () => {
    const list = [
      ...Array.from({ length: 4 }, () => art('2026-11-23', { source: 'Zed' })),
      ...Array.from({ length: 4 }, () => art('2026-11-23', { source: 'Beta' })),
      ...Array.from({ length: 2 }, () => art('2026-11-23', { source: 'Gamma' })),
      art('2026-11-23', { source: 'Delta' }),
      art('2026-11-23', { source: '  ' }),
    ];
    const s = computeStats(list, '2026-11-23');
    expect(s.topSources.map((t) => t.name)).toEqual(['Beta', 'Zed', 'Gamma']); // tie 4/4 -> alphabetical
    expect(s.topSources[0]).toEqual({ name: 'Beta', count: 4, pct: 33 }); // 4 of 12
    expect(s.sourceCount).toBe(4); // blank source ignored
    expect(s.total).toBe(12);
  });

  it('counts categories over the last 30 days only, most covered first', () => {
    const list = [
      art('2026-11-23', { category: 'ai' }),
      art('2026-11-22', { category: 'ai' }),
      art('2026-11-01', { category: 'tooling' }),
      art('2026-10-25', { category: 'engineering' }), // 29 days before -> inside
      art('2026-10-24', { category: 'engineering' }), // 30 days before -> outside
      art('2026-11-24', { category: 'qa-practice' }), // after the reference day -> excluded
    ];
    const s = computeStats(list, '2026-11-23');
    expect(s.categories).toEqual([
      { category: 'ai', count: 2 },
      { category: 'engineering', count: 1 },
      { category: 'tooling', count: 1 },
    ]);
  });

  it('ignores unreadable dates in per-day figures but still counts them in the total', () => {
    const s = computeStats([art('2026-11-23'), art('x', { publishedAt: 'not-a-date' }), art('y', { publishedAt: '' })], '2026-11-23');
    expect(s.total).toBe(3);
    expect(s.todayCount).toBe(1);
    expect(s.categories).toEqual([{ category: 'ai', count: 1 }]);
  });
});

describe('latestArticleDay', () => {
  it('returns null when nothing is readable', () => {
    expect(latestArticleDay([])).toBeNull();
    expect(latestArticleDay([art('x', { publishedAt: 'nope' })])).toBeNull();
  });
  it('returns the newest UTC day', () => {
    expect(latestArticleDay([art('2026-11-01'), art('2026-11-05')])).toBe('2026-11-05');
  });
});

describe('formatAgo', () => {
  const now = Date.parse('2026-11-23T12:00:00Z');
  it('formats minutes, hours and days', () => {
    expect(formatAgo('2026-11-23T11:30:00Z', now)).toBe('30m ago');
    expect(formatAgo('2026-11-23T09:00:00Z', now)).toBe('3h ago');
    expect(formatAgo('2026-11-21T12:00:00Z', now)).toBe('2d ago');
  });
  it('is never below 1m and tolerates bad input', () => {
    expect(formatAgo('2026-11-23T12:00:00Z', now)).toBe('1m ago');
    expect(formatAgo(null, now)).toBe('');
    expect(formatAgo('garbage', now)).toBe('');
  });
});

describe('computePeriodStats', () => {
  it('returns zeroed stats and a full-length daily series for empty input', () => {
    const s = computePeriodStats([], 7, '2026-11-23');
    expect(s.total).toBe(0);
    expect(s.daily).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(s.peakDay).toBeNull();
    expect(s.avgPerDay).toBe(0);
    expect(s.startDay).toBe('2026-11-17');
    expect(s.refDay).toBe('2026-11-23');
  });

  it('counts per day (oldest first), sources, categories, average and peak', () => {
    const list = [
      art('2026-11-23'),
      art('2026-11-23', { source: 'Beta', category: 'tooling' as Category }),
      art('2026-11-23', { source: 'Beta', category: 'tooling' as Category }),
      art('2026-11-21'),
    ];
    const s = computePeriodStats(list, 7, '2026-11-23');
    expect(s.total).toBe(4);
    expect(s.sourceCount).toBe(2);
    expect(s.daily).toEqual([0, 0, 0, 0, 1, 0, 3]);
    expect(s.peakDay).toEqual({ day: '2026-11-23', count: 3 });
    expect(s.avgPerDay).toBe(0.6);
    expect(s.topSources.map((x) => x.name)).toEqual(['Alpha', 'Beta']);
    expect(s.topSources[0].pct).toBe(50);
    expect(s.categories).toEqual([
      { category: 'ai', count: 2 },
      { category: 'tooling', count: 2 },
    ]);
  });

  it('supports a 30-day window', () => {
    const s = computePeriodStats([art('2026-10-25')], 30, '2026-11-23');
    expect(s.daily).toHaveLength(30);
    expect(s.startDay).toBe('2026-10-25');
    expect(s.daily[0]).toBe(1);
  });
});
