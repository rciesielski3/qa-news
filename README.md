# QA News

Public, read-only portal over the PAIOS Knowledge Layer. Daily Brief, Latest
News, Weekly Highlights, Monthly Recap. No business logic, no AI execution —
QA News only renders what PAIOS already curated.

## Stack

Next.js 14 (App Router), TypeScript, Tailwind. Fully static (`output: 'export'`)
so it can be hosted on GitHub Pages with zero server.

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # writes the static site to ./out
```

## Architecture: one seam, not a framework

Everything lives behind four functions in `src/lib/data.ts`:

```ts
getDailyBrief();
getLatestNews();
getWeeklyHighlights();
getMonthlyRecaps();
```

Right now they read the JSON fixtures in `/data`. Those fixtures are
placeholder content, written to match the real PAIOS response shape
(`src/lib/types.ts`) so the frontend can be built and reviewed before the
PAIOS Public API exists.

**Wiring the real API later** means rewriting those 4 functions to fetch,
e.g.:

```ts
export async function getDailyBrief(): Promise<DailyBrief> {
  const res = await fetch(`${process.env.PAIOS_API_URL}/daily-brief`);
  return res.json();
}
```

Nothing else in the app should need to change — every component only knows
about the types in `lib/types.ts`, never about where the data came from.

## Why the data is fetched at build time, not runtime

The site is a static export, so `getDailyBrief()` etc. run once, during
`npm run build` — not per visitor. Freshness comes from re-running the
build, not from client-side polling. `.github/workflows/deploy.yml` rebuilds
on every push to `main`; there's a commented-out daily cron in there for
once the real API is live, so the Daily Brief actually updates daily without
a manual push. This mirrors the OCDP pattern: scheduled, autonomous, no
standing server.

## Deploying to GitHub Pages

This is set up for a **custom subdomain** of an existing personal domain
(e.g. `qa-news.rciesielski.dev`), not the default
`username.github.io/qa-news` project path. Rationale: keeps this fully
decoupled from the main portfolio's hosting (no reverse-proxy, no shared
build pipeline) while still branding under the same name.

1. **DNS**: at your domain registrar/DNS provider, add a `CNAME` record:
   `qa-news` → `<your-username>.github.io`
2. **`public/CNAME`**: already contains `qa-news.rciesielski.dev` — edit if
   using a different subdomain.
3. Push this repo to GitHub, then **Settings → Pages**: set **Source** to
   **GitHub Actions**, and enter the same subdomain under **Custom domain**.
   Enable **Enforce HTTPS** once GitHub finishes verifying the DNS record
   (can take a few minutes).
4. Push to `main` — `.github/workflows/deploy.yml` builds and deploys
   automatically.

If you ever deploy without a custom domain (falling back to
`username.github.io/qa-news`), set a repo variable
`NEXT_BASE_PATH=/qa-news` in **Settings → Secrets and variables → Actions →
Variables** — the workflow picks it up automatically. Leave it unset for the
custom-domain setup above.

## Explicitly out of scope for this stage

Per the brief: search and a full archive are a later stage. `/weekly` and
`/monthly` currently render everything in the fixture data inline — no
per-week or per-month detail pages, no pagination. Adding those later means
adding `generateStaticParams` to new dynamic routes; nothing in the current
structure blocks that, it's just not built yet.

## Design system

Dark, log-style layout: every news item is one entry in a vertical
"pipeline" (a nod to CI/CD run logs, the audience's native habitat), with a
colored dot per category. Type: IBM Plex Serif for headlines, IBM Plex Sans
for body, IBM Plex Mono for timestamps/tags/metadata — self-hosted via
`@fontsource` (not `next/font/google`), so the build doesn't depend on
outbound access to Google Fonts at build time. Tokens live in
`tailwind.config.ts`.
