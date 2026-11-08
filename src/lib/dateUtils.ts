import type { Article } from '@/lib/types';

export function getUTCToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function getYesterdayUTC(): Date {
  const today = getUTCToday();
  return new Date(today.getTime() - 24 * 60 * 60 * 1000);
}

export function getNextRefreshTime(): { minutesUntil: number; timeString: string } {
  const now = new Date();
  const nextRefresh = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 5, 0, 0));

  if (now > nextRefresh) {
    nextRefresh.setUTCDate(nextRefresh.getUTCDate() + 1);
  }

  const minutesUntil = Math.floor((nextRefresh.getTime() - now.getTime()) / (1000 * 60));
  const hours = Math.floor(minutesUntil / 60);
  const mins = minutesUntil % 60;

  let timeString = '';
  if (hours > 0) {
    timeString = `${hours}h ${mins}m`;
  } else {
    timeString = `${mins}m`;
  }

  return { minutesUntil, timeString };
}

export function getArticlesForDate(articles: Article[], targetDate: Date): Article[] {
  const targetStart = targetDate.getTime();
  const targetEnd = targetStart + 24 * 60 * 60 * 1000;

  return articles.filter((article) => {
    if (!article.publishedAt) return false;
    const pubTime = new Date(article.publishedAt).getTime();
    return pubTime >= targetStart && pubTime < targetEnd;
  });
}

export function isDayBeforeRefreshTime(): boolean {
  const now = new Date();
  const currentUTCHour = now.getUTCHours();
  const currentUTCMinutes = now.getUTCMinutes();
  const currentMinutesSinceMidnight = currentUTCHour * 60 + currentUTCMinutes;
  const refreshTimeMinutes = 5 * 60;

  return currentMinutesSinceMidnight < refreshTimeMinutes;
}

export function formatTimeInBothZones(isoString: string): string {
  const date = new Date(isoString);

  const warsawOffset = 2;
  const warsawDate = new Date(date.getTime() + warsawOffset * 60 * 60 * 1000);
  const warsawHours = warsawDate.getUTCHours().toString().padStart(2, '0');
  const warsawMinutes = warsawDate.getUTCMinutes().toString().padStart(2, '0');

  return `${warsawHours}:${warsawMinutes}`;
}

export function getNextRefreshTimeWithZones(): {
  minutesUntil: number;
  timeString: string;
  displayString: string;
} {
  const result = getNextRefreshTime();

  const now = new Date();
  const nextRefresh = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 5, 0, 0));
  if (now > nextRefresh) {
    nextRefresh.setUTCDate(nextRefresh.getUTCDate() + 1);
  }

  const warsawOffset = 2;
  const warsawDate = new Date(nextRefresh.getTime() + warsawOffset * 60 * 60 * 1000);
  const warsawHours = warsawDate.getUTCHours().toString().padStart(2, '0');
  const warsawMinutes = warsawDate.getUTCMinutes().toString().padStart(2, '0');
  const warsawTime = `${warsawHours}:${warsawMinutes}`;

  return {
    minutesUntil: result.minutesUntil,
    timeString: result.timeString,
    displayString: `at ${warsawTime} GMT+2`
  };
}
