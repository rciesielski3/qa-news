import type { Article } from '@/lib/types';

export function getUTCToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function getYesterdayUTC(): Date {
  const today = getUTCToday();
  return new Date(today.getTime() - 24 * 60 * 60 * 1000);
}

/** Hour (UTC) at which the daily-brief pipeline is scheduled (cron '0 8 * * *'). The site goes live some minutes later. */
export const REFRESH_HOUR_UTC = 8;

const WARSAW_TZ = 'Europe/Warsaw';

export function formatRefreshHourUTC(): string {
  return `${String(REFRESH_HOUR_UTC).padStart(2, '0')}:00 UTC`;
}

function computeNextRefresh(now: Date): Date {
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), REFRESH_HOUR_UTC, 0, 0));
  if (now > next) {
    next.setUTCDate(next.getUTCDate() + 1);
  }
  return next;
}

function warsawParts(date: Date): { time: string; zone: string } {
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: WARSAW_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);
  const zone = new Intl.DateTimeFormat('en-GB', {
    timeZone: WARSAW_TZ,
    timeZoneName: 'shortOffset',
  })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')?.value;
  return { time, zone: zone ?? 'GMT+1' };
}

/** Zone label for Warsaw at the given instant, e.g. 'GMT+1' (winter) or 'GMT+2' (summer). */
export function getWarsawZoneLabel(isoString?: string): string {
  return warsawParts(isoString ? new Date(isoString) : new Date()).zone;
}

export function getNextRefreshTime(): { minutesUntil: number; timeString: string } {
  const now = new Date();
  const nextRefresh = computeNextRefresh(now);

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
  const refreshTimeMinutes = REFRESH_HOUR_UTC * 60;

  return currentMinutesSinceMidnight < refreshTimeMinutes;
}

export function formatTimeInBothZones(isoString: string): string {
  return warsawParts(new Date(isoString)).time;
}

export function getNextRefreshTimeWithZones(): {
  minutesUntil: number;
  timeString: string;
  displayString: string;
} {
  const result = getNextRefreshTime();
  const nextRefresh = computeNextRefresh(new Date());
  const { time, zone } = warsawParts(nextRefresh);

  return {
    minutesUntil: result.minutesUntil,
    timeString: result.timeString,
    displayString: `daily ~${time} ${zone}`,
  };
}
