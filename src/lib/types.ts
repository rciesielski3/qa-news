// These types are the contract between QA News and the PAIOS Knowledge
// Layer. QA News owns none of this data — it only renders it. When the
// real PAIOS Public API exists, its JSON responses should match these
// shapes exactly (or `lib/data.ts` gets a mapping layer, not this file).

export type Category = 'test-automation' | 'ai' | 'engineering' | 'qa-practice' | 'tooling';

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  summary?: string;
  url: string;
  source: string;
  category: Category;
  publishedAt: string; // ISO 8601 datetime
  tags?: string[];
}

export interface DailyBrief {
  date: string; // ISO date, e.g. "2026-07-12"
  updatedAt: string; // ISO datetime
  sourcesScanned: number;
  storiesSelected: number;
  lede: string; // 2-3 sentence human-readable summary of the day
  items: Article[];
}

export interface WeeklyHighlight {
  weekOf: string; // ISO date of the Monday that starts the week
  summary: string;
  items: Article[];
}

export interface MonthlyRecap {
  month: string; // "2026-06"
  summary: string;
  themes: { title: string; description: string }[];
  items: Article[];
}
