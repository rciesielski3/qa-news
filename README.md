# QA News

Public, read-only portal over the ChiefofStaff article pipeline: Daily,
Weekly and Monthly views of curated QA news. No business logic, no AI
execution — QA News only renders what the pipeline already curated.

## Stack

Next.js 14 (App Router), TypeScript, Tailwind. Fully static (`output: 'export'`)
so it can be hosted on GitHub Pages with zero server.

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # writes the static site to ./out
```

## Data

The site reads a single file, `public/latest.json`: every article from the
last 30 days, written by the ChiefofStaff `export-qa-news` workflow (one PR
per export, auto-merged). The Daily, Weekly and Monthly pages fetch it in the
browser and filter by period (`src/lib/filtering.ts`), so there are no
per-period JSON files. `src/lib/types.ts` describes the article shape.

Each merge to `main` triggers `.github/workflows/deploy.yml`, which rebuilds
the static site.

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
`/monthly` show the matching slice of `latest.json` — no per-week or
per-month detail pages. Adding those later means
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
