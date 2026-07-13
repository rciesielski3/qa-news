import { promises as fs } from 'fs';
import path from 'path';
import type { Article, DailyBrief, WeeklyHighlight, MonthlyRecap } from './types';

// ---------------------------------------------------------------------------
// Single seam for "read curated data". Tries PAIOS API first (via env var
// PAIOS_API_URL), then falls back to local JSON fixtures. Enables gradual
// API adoption: works offline during dev, switches to live API in production
// once PAIOS_API_URL is set.
//
// Since QA News exports as fully static (`output: 'export'`), these run at
// BUILD TIME. Freshness comes from re-running the build (scheduled GitHub
// Action). This mirrors OCDP: autonomous, scheduled, zero standing infra.
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const API_URL = process.env.PAIOS_API_URL;
const LATEST_JSON_URL = process.env.PAIOS_LATEST_JSON_URL;

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
  return JSON.parse(raw) as T;
}

async function fetchFromApi<T>(endpoint: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function getDailyBrief(): Promise<DailyBrief> {
  const api = await fetchFromApi<DailyBrief>('/daily-brief');
  return api || readJson<DailyBrief>('daily-brief.json');
}

export async function getLatestNews() {
  const api = await fetchFromApi<{ items: DailyBrief['items'] }>('/latest-news');
  if (api) return api.items;
  const brief = await readJson<{ items: DailyBrief['items'] }>('latest-news.json');
  return brief.items;
}

export async function getWeeklyHighlights(): Promise<WeeklyHighlight[]> {
  const api = await fetchFromApi<{ weeks: WeeklyHighlight[] }>('/weekly-highlights');
  if (api) return api.weeks;
  const data = await readJson<{ weeks: WeeklyHighlight[] }>('weekly-highlights.json');
  return data.weeks;
}

export async function getMonthlyRecaps(): Promise<MonthlyRecap[]> {
  const api = await fetchFromApi<{ months: MonthlyRecap[] }>('/monthly-recaps');
  if (api) return api.months;
  const data = await readJson<{ months: MonthlyRecap[] }>('monthly-recap.json');
  return data.months;
}

export async function getLatestArticles(): Promise<Article[]> {
  // Try Knowledge Layer export endpoint first (PAIOS_LATEST_JSON_URL)
  if (LATEST_JSON_URL) {
    try {
      const res = await fetch(LATEST_JSON_URL, { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as { articles: Article[] };
        return data.articles;
      }
    } catch {
      // Fall through to local file
    }
  }
  // Fall back to local fixture in public/latest.json
  const raw = await fs.readFile(path.join(PUBLIC_DIR, 'latest.json'), 'utf-8');
  const data = JSON.parse(raw) as { articles: Article[] };
  return data.articles;
}
