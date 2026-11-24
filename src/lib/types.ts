// These types are the contract between QA News and the ChiefofStaff
// pipeline. QA News owns none of this data — it only renders it. When the
// real public API exists, its JSON responses should match these
// shapes exactly (or `lib/data.ts` gets a mapping layer, not this file).

export type Category = 'test-automation' | 'ai' | 'engineering' | 'qa-practice' | 'tooling';

export interface Article {
  id: string;
  title: string;
  description?: string;
  subtitle?: string;
  summary?: string;
  url: string;
  source: string;
  category: Category;
  publishedAt: string; // ISO 8601 datetime
  tags?: string[];
  score?: number; // Relevance score from the pipeline; higher is better
}

export interface DailyBrief {
  date: string; // ISO date, e.g. "2026-07-12"
  updatedAt: string; // ISO datetime
  sourcesScanned: number;
  storiesSelected: number;
  lede: string; // 2-3 sentence human-readable summary of the day
  items: Article[];
}
