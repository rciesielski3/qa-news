# QA-News Real Article Data Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Populate QA-News with real article data by creating a QA-specific RSS feed pipeline in ChiefofStaff, with daily GitHub Action exports to QA-News's `latest.json`.

**Architecture:** 
1. Define QA-specific RSS sources (testing frameworks, QA blogs, engineering practices)
2. Create configurable category keyword mappings (JSON config, not hardcoded)
3. Export top 50 articles in QA-News format to qa-news/public/latest.json
4. Schedule GitHub Action (daily) to keep data fresh

**Tech Stack:** TypeScript, rss-parser, GitHub Actions, Node.js, JSON config

## Global Constraints

- Article data must be real URLs (not example.com placeholders)
- Must support 5 categories: qa-practice, test-automation, tooling, engineering, ai
- Export format: `{articles: [{id, title, summary, url, source, category, publishedAt, tags}]}`
- QA-specific sources (testing frameworks, QA practices, engineering blogs)
- No external API keys required (RSS feeds are public)
- Keywords and source matching rules defined in JSON config (not hardcoded)

---

## File Structure

**New files:**
- `ChiefofStaff/src/cli/qa-news-feeds.ts` - QA-specific RSS source definitions
- `ChiefofStaff/src/config/qa-news-categories.json` - Category keywords (data-driven)
- `ChiefofStaff/src/business-logic/categorize-article.ts` - Article → QA category mapper
- `ChiefofStaff/src/business-logic/export-qa-news.ts` - Export to QA-News format
- `ChiefofStaff/.github/workflows/update-qa-news.yml` - Daily update workflow

**Modified files:**
- `qa-news/public/latest.json` - Output (populated by workflow)

---

### Task 1: Define QA-Specific RSS Feed Sources

**Files:**
- Create: `ChiefofStaff/src/cli/qa-news-feeds.ts`
- Consumes: None (new file)
- Produces: `QANewsFeedSource[]` interface and constant `QA_NEWS_FEEDS`

**Steps:**

- [ ] **Step 1: Create feed sources file**

Create `ChiefofStaff/src/cli/qa-news-feeds.ts`:

```typescript
/**
 * QA-specific RSS feed sources for QA News
 * Each source maps to one or more QA categories based on content type
 */

export interface QANewsFeedSource {
  url: string;
  name: string;
  categories: string[]; // One or more of: qa-practice, test-automation, tooling, engineering, ai
}

/**
 * Curated list of QA/testing industry RSS feeds
 * - Testing frameworks: Vitest, Jest, Cypress, Playwright
 * - QA practices: OWASP, Sauce Labs, BrowserStack
 * - Engineering: Stripe, GitHub, Vercel (how they test at scale)
 * - AI & LLMs: Anthropic, OpenAI (for LLM-based testing)
 */
export const QA_NEWS_FEEDS: QANewsFeedSource[] = [
  // Testing Frameworks
  {
    url: 'https://github.com/vitest-dev/vitest/releases.atom',
    name: 'Vitest Releases',
    categories: ['test-automation', 'tooling']
  },
  {
    url: 'https://github.com/jestjs/jest/releases.atom',
    name: 'Jest Releases',
    categories: ['test-automation', 'tooling']
  },
  {
    url: 'https://github.com/playwright-dev/playwright/releases.atom',
    name: 'Playwright Releases',
    categories: ['test-automation', 'tooling']
  },
  {
    url: 'https://github.com/cypress-io/cypress/releases.atom',
    name: 'Cypress Releases',
    categories: ['test-automation', 'tooling']
  },

  // QA Practices & Security
  {
    url: 'https://owasp.org/feed.xml',
    name: 'OWASP',
    categories: ['qa-practice', 'engineering']
  },
  {
    url: 'https://www.saucelabs.com/blog/feed',
    name: 'Sauce Labs Blog',
    categories: ['test-automation', 'qa-practice']
  },

  // Engineering @ Scale (testing practices)
  {
    url: 'https://stripe.com/blog/feed.xml',
    name: 'Stripe Blog',
    categories: ['engineering', 'test-automation']
  },
  {
    url: 'https://github.blog/engineering.atom',
    name: 'GitHub Engineering',
    categories: ['engineering', 'tooling']
  },
  {
    url: 'https://vercel.com/blog/feed.xml',
    name: 'Vercel Blog',
    categories: ['engineering', 'tooling']
  },

  // AI & LLM Testing
  {
    url: 'https://www.anthropic.com/feed.xml',
    name: 'Anthropic',
    categories: ['ai', 'qa-practice']
  },
  {
    url: 'https://openai.com/news/rss.xml',
    name: 'OpenAI',
    categories: ['ai', 'qa-practice']
  },

  // General Tech
  {
    url: 'https://lobste.rs/rss',
    name: 'Lobsters',
    categories: ['engineering', 'tooling', 'test-automation']
  }
];
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
cd /Users/rafalciesielski/Developer/ChiefofStaff
npx tsc --noEmit src/cli/qa-news-feeds.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/cli/qa-news-feeds.ts
git commit -m "feat: add QA-specific RSS feed sources for QA News"
```

---

### Task 2: Create Category Keywords Configuration (Data-Driven)

**Files:**
- Create: `ChiefofStaff/src/config/qa-news-categories.json`
- Consumes: None
- Produces: Configurable category keywords (easy to update)

**Steps:**

- [ ] **Step 1: Create category configuration file**

Create `ChiefofStaff/src/config/qa-news-categories.json`:

```json
{
  "categories": {
    "test-automation": {
      "keywords": [
        "test", "jest", "vitest", "cypress", "playwright", "e2e",
        "unit test", "testing framework", "test suite", "test runner",
        "mocha", "ava", "tap", "jasmine", "qunit", "webdriver",
        "puppeteer", "testcafe", "nightwatch", "codeceptjs"
      ],
      "sourceMatches": ["Jest", "Vitest", "Cypress", "Playwright", "Testing"]
    },
    "qa-practice": {
      "keywords": [
        "qa", "quality assurance", "testing", "security", "vulnerability",
        "owasp", "penetration", "best practice", "standard", "compliance",
        "bug", "defect", "regression", "test case", "manual testing",
        "accessibility", "wcag", "a11y", "performance testing"
      ],
      "sourceMatches": ["OWASP", "QA", "Security", "Sauce Labs"]
    },
    "tooling": {
      "keywords": [
        "tool", "framework", "library", "build", "webpack", "vite",
        "config", "lint", "prettier", "eslint", "release", "version",
        "package", "dependency", "npm", "yarn", "pnpm", "plugin",
        "extension", "integration", "cli", "api", "sdk"
      ],
      "sourceMatches": ["Release", "Github", "Tools"]
    },
    "engineering": {
      "keywords": [
        "engineering", "architecture", "performance", "debug", "observability",
        "logging", "monitoring", "scale", "deployment", "infrastructure",
        "production", "devops", "ci/cd", "pipeline", "automation",
        "optimization", "refactor", "pattern", "design", "scalability"
      ],
      "sourceMatches": ["Stripe", "GitHub", "Vercel", "Engineering", "Blog"]
    },
    "ai": {
      "keywords": [
        "ai", "artificial intelligence", "llm", "large language model",
        "machine learning", "neural", "gpt", "claude", "model",
        "embedding", "generative", "nlp", "deep learning", "transformer",
        "fine-tune", "prompt", "agent", "reasoning", "hallucination"
      ],
      "sourceMatches": ["Anthropic", "OpenAI", "AI", "LLM"]
    }
  },
  "defaults": {
    "fallbackCategory": "engineering"
  }
}
```

- [ ] **Step 2: Verify JSON syntax**

```bash
cat /Users/rafalciesielski/Developer/ChiefofStaff/src/config/qa-news-categories.json | jq '.' > /dev/null && echo "Valid JSON"
```

Expected: "Valid JSON"

- [ ] **Step 3: Commit configuration**

```bash
cd /Users/rafalciesielski/Developer/ChiefofStaff
git add src/config/qa-news-categories.json
git commit -m "config: add QA News category keywords configuration (data-driven)"
```

---

### Task 3: Create Article Categorizer

**Files:**
- Create: `ChiefofStaff/src/business-logic/categorize-article.ts`
- Consumes: `qa-news-categories.json` config, `Article` type
- Produces: `categorizeForQANews(article: Article): string[]` function

**Steps:**

- [ ] **Step 1: Create categorizer logic**

Create `ChiefofStaff/src/business-logic/categorize-article.ts`:

```typescript
import { Article } from './normalize-article';
import categoryConfig from '../config/qa-news-categories.json';

interface CategoryRules {
  keywords: string[];
  sourceMatches: string[];
}

/**
 * Map article content to QA News categories using configurable keywords
 * 
 * Algorithm:
 * 1. Combine title + summary text
 * 2. For each category, check if any keywords match (case-insensitive, word boundary)
 * 3. For each category, check if source matches configured source patterns
 * 4. Return all matching categories
 * 5. If no matches, use fallback category (engineering)
 * 
 * @param article - Article to categorize
 * @returns Array of matching category IDs
 */
export function categorizeForQANews(article: Article): string[] {
  const text = `${article.title} ${article.summary}`.toLowerCase();
  const categories = new Set<string>();

  const config = categoryConfig as any;

  // Check each category's rules
  for (const [categoryId, rules] of Object.entries(config.categories)) {
    const categoryRules = rules as CategoryRules;

    // Check keyword matches
    for (const keyword of categoryRules.keywords) {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text)) {
        categories.add(categoryId);
        break; // Match found for this category, move to next
      }
    }

    // Check source name matches
    if (!categories.has(categoryId)) {
      for (const sourceMatch of categoryRules.sourceMatches) {
        if (article.source.toLowerCase().includes(sourceMatch.toLowerCase())) {
          categories.add(categoryId);
          break;
        }
      }
    }
  }

  // Use fallback if no categories matched
  if (categories.size === 0) {
    categories.add(config.defaults.fallbackCategory);
  }

  return Array.from(categories);
}
```

- [ ] **Step 2: Write test**

Create `ChiefofStaff/tests/business-logic/categorize-article.test.ts`:

```typescript
import { categorizeForQANews } from '../../src/business-logic/categorize-article';
import { Article } from '../../src/business-logic/normalize-article';

describe('categorizeForQANews', () => {
  const mockArticle = (title: string, summary: string, source: string): Article => ({
    id: 'test-1',
    title,
    summary,
    url: 'https://example.com/test',
    source,
    category: 'tooling', // placeholder
    publishedAt: new Date().toISOString(),
    tags: []
  });

  it('should categorize Jest releases as test-automation using keywords', () => {
    const article = mockArticle(
      'Jest 30.0 Released',
      'Jest reaches feature parity with test runners',
      'Some Source'
    );
    const categories = categorizeForQANews(article);
    expect(categories).toContain('test-automation');
  });

  it('should categorize Vitest as test-automation using source match', () => {
    const article = mockArticle(
      'New release available',
      'Check the latest updates',
      'Vitest Releases'
    );
    const categories = categorizeForQANews(article);
    expect(categories).toContain('test-automation');
  });

  it('should categorize security articles as qa-practice using keywords', () => {
    const article = mockArticle(
      'Vulnerability in Testing',
      'OWASP Top 10 and best practice guidelines',
      'Security Blog'
    );
    const categories = categorizeForQANews(article);
    expect(categories).toContain('qa-practice');
  });

  it('should categorize engineering articles as engineering', () => {
    const article = mockArticle(
      'Architecture Patterns',
      'Engineering practices for scalable systems',
      'Tech Blog'
    );
    const categories = categorizeForQANews(article);
    expect(categories).toContain('engineering');
  });

  it('should use fallback category when no match found', () => {
    const article = mockArticle(
      'Random Article',
      'About unrelated topics',
      'Unknown Source'
    );
    const categories = categorizeForQANews(article);
    expect(categories).toContain('engineering');
  });
});
```

- [ ] **Step 3: Run tests**

```bash
cd /Users/rafalciesielski/Developer/ChiefofStaff
npm test -- tests/business-logic/categorize-article.test.ts
```

Expected: All 5 tests pass

- [ ] **Step 4: Commit**

```bash
git add src/business-logic/categorize-article.ts tests/business-logic/categorize-article.test.ts
git commit -m "feat: add article categorizer using config-driven keywords"
```

---

### Task 4: Create QA-News Export Function

**Files:**
- Create: `ChiefofStaff/src/business-logic/export-qa-news.ts`
- Consumes: `Article` type, `categorizeForQANews()` function
- Produces: `QANewsExport` interface and `exportQANews()` function

**Steps:**

- [ ] **Step 1: Create export function**

Create `ChiefofStaff/src/business-logic/export-qa-news.ts`:

```typescript
import { Article } from './normalize-article';
import { categorizeForQANews } from './categorize-article';

/**
 * Article format for QA News
 * Maps from ChiefofStaff Article to QA-News display format
 */
export interface QANewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string; // Primary category (first from categorizeForQANews)
  publishedAt: string;
  tags: string[];
}

/**
 * Export envelope for QA News
 */
export interface QANewsExport {
  articles: QANewsArticle[];
}

/**
 * Convert ChiefofStaff Article to QA-News format
 * 
 * Algorithm:
 * 1. Categorize article using QA-specific rules
 * 2. Use first category as primary (for display)
 * 3. Extract summary from article content or use fallback
 * 4. Return in QA-News JSON schema
 * 
 * @param article - Article from ChiefofStaff
 * @returns QA-News formatted article
 */
function articleToQANews(article: Article): QANewsArticle {
  const categories = categorizeForQANews(article);
  const primaryCategory = categories[0] || 'engineering';

  return {
    id: article.id,
    title: article.title,
    summary: article.summary,
    url: article.url,
    source: article.source,
    category: primaryCategory,
    publishedAt: article.publishedAt,
    tags: article.tags || []
  };
}

/**
 * Export top N articles in QA-News format
 * 
 * Algorithm:
 * 1. Filter articles: only keep those with valid URLs (not example.com)
 * 2. Sort by publishedAt descending (newest first)
 * 3. Convert to QA-News format
 * 4. Take top N (default 50)
 * 
 * @param articles - All articles from ChiefofStaff store
 * @param limit - Number of articles to export (default: 50)
 * @returns QA-News export envelope
 */
export function exportQANews(articles: Article[], limit: number = 50): QANewsExport {
  const validArticles = articles.filter(a => {
    // Filter out placeholder URLs
    return !a.url.includes('example.com') && a.url.startsWith('http');
  });

  const sorted = validArticles.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const latest = sorted.slice(0, limit);

  return {
    articles: latest.map(articleToQANews)
  };
}
```

- [ ] **Step 2: Write test**

Create `ChiefofStaff/tests/business-logic/export-qa-news.test.ts`:

```typescript
import { exportQANews, articleToQANews } from '../../src/business-logic/export-qa-news';
import { Article } from '../../src/business-logic/normalize-article';

describe('exportQANews', () => {
  const mockArticle = (id: string, title: string, url: string, source: string): Article => ({
    id,
    title,
    summary: 'Test summary',
    url,
    source,
    category: 'tooling',
    publishedAt: new Date('2026-07-16T12:00:00Z').toISOString(),
    tags: ['test', 'automation']
  });

  it('should filter out placeholder URLs', () => {
    const articles = [
      mockArticle('1', 'Real Article', 'https://vitest.dev/release/2.1', 'Vitest'),
      mockArticle('2', 'Placeholder Article', 'https://example.com/fake', 'Fake')
    ];

    const result = exportQANews(articles);
    expect(result.articles).toHaveLength(1);
    expect(result.articles[0].id).toBe('1');
  });

  it('should sort by publishedAt descending', () => {
    const articles = [
      { ...mockArticle('1', 'Old', 'https://a.com/1', 'A'), publishedAt: '2026-07-14T12:00:00Z' },
      { ...mockArticle('2', 'New', 'https://b.com/2', 'B'), publishedAt: '2026-07-16T12:00:00Z' },
      { ...mockArticle('3', 'Newest', 'https://c.com/3', 'C'), publishedAt: '2026-07-17T12:00:00Z' }
    ];

    const result = exportQANews(articles);
    expect(result.articles[0].id).toBe('3');
    expect(result.articles[1].id).toBe('2');
    expect(result.articles[2].id).toBe('1');
  });

  it('should limit to N articles', () => {
    const articles = Array.from({ length: 100 }, (_, i) =>
      mockArticle(`${i}`, `Article ${i}`, `https://a.com/${i}`, 'Source')
    );

    const result = exportQANews(articles, 30);
    expect(result.articles).toHaveLength(30);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
cd /Users/rafalciesielski/Developer/ChiefofStaff
npm test -- tests/business-logic/export-qa-news.test.ts
```

Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/business-logic/export-qa-news.ts tests/business-logic/export-qa-news.test.ts
git commit -m "feat: add QA-News export function with filtering and categorization"
```

---

### Task 5: Create CLI Command to Generate QA-News Data

**Files:**
- Create: `ChiefofStaff/src/cli/qa-news-export.ts`
- Consumes: `QA_NEWS_FEEDS`, `exportQANews()`, `fetchRSS()`
- Produces: Callable CLI command that outputs QA-News JSON

**Steps:**

- [ ] **Step 1: Create CLI command**

Create `ChiefofStaff/src/cli/qa-news-export.ts`:

```typescript
import { fetchRSS } from '../business-logic/rss-fetch';
import { normalizeArticle } from '../business-logic/normalize-article';
import { exportQANews } from '../business-logic/export-qa-news';
import { QA_NEWS_FEEDS } from './qa-news-feeds';

/**
 * Generate QA-News article export
 * 
 * Algorithm:
 * 1. Fetch articles from all QA-specific RSS feeds
 * 2. Normalize to Article schema
 * 3. Categorize for QA News
 * 4. Export top 50 as QA-News JSON
 * 5. Return as string (ready to write to file)
 * 
 * @returns JSON string of QA-News export
 */
export async function generateQANewsExport(): Promise<string> {
  console.log(`Fetching ${QA_NEWS_FEEDS.length} QA News feeds...`);

  const allArticles = [];

  for (const feed of QA_NEWS_FEEDS) {
    try {
      console.log(`  Fetching ${feed.name}...`);
      const rawArticles = await fetchRSS(feed.url, feed.name);
      
      const normalized = rawArticles.map(raw =>
        normalizeArticle(
          raw.link,
          raw.title,
          raw.pubDate,
          raw.content,
          raw.source,
          feed.categories[0] || 'engineering'
        )
      );

      allArticles.push(...normalized);
    } catch (error) {
      console.warn(`  Failed to fetch ${feed.name}: ${(error as Error).message}`);
      // Continue with other feeds
    }
  }

  console.log(`Fetched ${allArticles.length} total articles`);

  const export_ = exportQANews(allArticles, 50);
  return JSON.stringify(export_, null, 2);
}

// Main entry point for CLI
if (require.main === module) {
  generateQANewsExport()
    .then(json => {
      console.log(json);
    })
    .catch(error => {
      console.error('Failed to generate QA News export:', error);
      process.exit(1);
    });
}
```

- [ ] **Step 2: Test locally (dry run)**

```bash
cd /Users/rafalciesielski/Developer/ChiefofStaff
npm run build
npx ts-node src/cli/qa-news-export.ts 2>&1 | head -50
```

Expected: Should show fetching progress and JSON output with real articles (non-example.com URLs)

- [ ] **Step 3: Commit**

```bash
git add src/cli/qa-news-export.ts
git commit -m "feat: add CLI command to generate QA-News export from RSS feeds"
```

---

### Task 6: Set Up GitHub Action Workflow

**Files:**
- Create: `ChiefofStaff/.github/workflows/update-qa-news.yml`
- Consumes: `qa-news-export.ts` CLI command
- Produces: Workflow that runs daily, exports data, commits to qa-news repo

**Steps:**

- [ ] **Step 1: Create workflow file**

Create `ChiefofStaff/.github/workflows/update-qa-news.yml`:

```yaml
name: Update QA News Data

on:
  schedule:
    # Run daily at 9 AM UTC
    - cron: '0 9 * * *'
  workflow_dispatch:  # Allow manual trigger

jobs:
  update-qa-news:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout ChiefofStaff
        uses: actions/checkout@v4
        with:
          path: ChiefofStaff
          token: ${{ secrets.QA_NEWS_TOKEN }}

      - name: Checkout QA-News
        uses: actions/checkout@v4
        with:
          repository: rciesielski3/qa-news
          path: qa-news
          token: ${{ secrets.QA_NEWS_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install ChiefofStaff dependencies
        working-directory: ChiefofStaff
        run: npm ci

      - name: Build ChiefofStaff
        working-directory: ChiefofStaff
        run: npm run build

      - name: Generate QA-News export
        working-directory: ChiefofStaff
        run: |
          npx ts-node src/cli/qa-news-export.ts > ../qa-news-export.json

      - name: Validate JSON
        run: |
          cat ../qa-news-export.json | jq '.' > /dev/null || (echo "Invalid JSON"; exit 1)
          ARTICLE_COUNT=$(cat ../qa-news-export.json | jq '.articles | length')
          echo "Generated export with $ARTICLE_COUNT articles"

      - name: Update QA-News latest.json
        working-directory: qa-news
        run: |
          cp ../qa-news-export.json public/latest.json
          git config user.email "github-actions@github.com"
          git config user.name "GitHub Actions"
          git add public/latest.json
          git diff --cached --quiet || git commit -m "data: update latest articles from ChiefofStaff RSS feeds"

      - name: Push to QA-News
        working-directory: qa-news
        run: |
          git push origin main || echo "No changes to push"
```

- [ ] **Step 2: Verify workflow syntax**

```bash
cd /Users/rafalciesielski/Developer/ChiefofStaff
cat .github/workflows/update-qa-news.yml | head -20
```

Expected: Valid YAML (no errors)

- [ ] **Step 3: Commit workflow**

```bash
git add .github/workflows/update-qa-news.yml
git commit -m "ci: add daily GitHub Action to update QA-News article data"
```

---

### Task 7: Generate Real Data and Verify

**Files:**
- Modify: `qa-news/public/latest.json`
- Consumes: Output from `qa-news-export.ts` CLI
- Produces: Real article data in QA-News format

**Steps:**

- [ ] **Step 1: Run export locally**

```bash
cd /Users/rafalciesielski/Developer/ChiefofStaff
npm run build
npx ts-node src/cli/qa-news-export.ts > /tmp/qa-news-latest.json
```

- [ ] **Step 2: Validate output**

```bash
cat /tmp/qa-news-latest.json | jq '.articles | length'
cat /tmp/qa-news-latest.json | jq '.articles[0]'
```

Expected: 
- Should show article count (1-50)
- First article should have real URL (https://...), not example.com

- [ ] **Step 3: Copy to QA-News**

```bash
cp /tmp/qa-news-latest.json /Users/rafalciesielski/Developer/qa-news/public/latest.json
```

- [ ] **Step 4: Verify QA-News build still works**

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm run build 2>&1 | tail -10
```

Expected: Build succeeds, static export completes

- [ ] **Step 5: Commit real data**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add public/latest.json
git commit -m "data: populate with real articles from QA RSS feeds"
git push origin main
```

- [ ] **Step 6: Push ChiefofStaff changes**

```bash
cd /Users/rafalciesielski/Developer/ChiefofStaff
git push origin main
```

---

## Success Criteria

✅ QA-News displays real article data (no example.com URLs)  
✅ Articles are properly categorized using config-driven keywords  
✅ Category keywords can be updated in JSON without code changes  
✅ All article links work (external URLs)  
✅ Brief cards show real sources and metadata  
✅ GitHub Action runs successfully and keeps data fresh daily  
✅ New articles appear within 24 hours of RSS publication  

---
