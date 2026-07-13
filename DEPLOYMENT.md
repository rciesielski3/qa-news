# Deployment Runbook for QA News

## Automatic Deployment (GitHub Actions)

QA News is deployed automatically to GitHub Pages via GitHub Actions.

### How It Works

1. **Trigger**: Every push to the `main` branch automatically triggers the deployment workflow
2. **Build**: GitHub Actions runs `npm ci && npm run build` on Ubuntu latest with Node 20
3. **Upload**: The `./out` directory (Next.js static export) is uploaded as a GitHub Pages artifact
4. **Deploy**: GitHub Actions deploys the artifact to GitHub Pages at `qa-news.rciesielski.dev`

### Workflow File

The workflow is defined in `.github/workflows/deploy.yml` and handles:
- Dependency installation (`npm ci`)
- Build process (`npm run build`)
- GitHub Pages configuration and authentication
- Automatic deployment with URL output

### Monitoring Deployment

Check deployment status:
1. Go to the repository on GitHub
2. Click the **Actions** tab
3. Click the latest workflow run for "Deploy QA News to GitHub Pages"
4. Review the build and deploy job logs
5. Verify the live site at https://qa-news.rciesielski.dev

### What Gets Deployed

The `./out` directory contains:
- Static HTML pages (index.html for each route)
- CSS and JavaScript bundles (`_next/`)
- Public assets (CNAME, robots.txt, latest.json, etc.)
- 404 error page

## Manual Deployment (if needed)

If you need to re-deploy without pushing to main:

1. Go to **Actions** tab on GitHub
2. Click **Deploy QA News to GitHub Pages**
3. Click **Run workflow** → **Run workflow on main**
4. Wait for the workflow to complete

## Environment Variables

### Build-time Variables

- **`NEXT_BASE_PATH`** (optional, repo variable): Set to `/qa-news` only if falling back from custom domain to default GitHub Pages project path
  - **Current**: Empty (using custom domain `qa-news.rciesielski.dev`)
  - **When to change**: Only if you remove the CNAME custom domain and want to serve from `username.github.io/qa-news/`

### Runtime Configuration

The app reads `latest.json` from the same domain root. Ensure:
- `public/latest.json` exists and is valid before deployment
- Or `PAIOS_LATEST_JSON_URL` is available at build time if fetching from external source

## Custom Domain Setup

The site uses a custom domain: **qa-news.rcieskelski.dev**

Configuration:
- **CNAME file**: `public/CNAME` contains `qa-news.rciesielski.dev`
- **DNS**: Ensure DNS records point to GitHub Pages (ask repo admin if using a different domain)

The CNAME file is automatically copied to `./out` during the build and uploaded with the deployment.

## Verification Checklist

After deployment:

- [ ] GitHub Actions workflow completed successfully (green checkmark)
- [ ] Live site loads at https://qa-news.rciesielski.dev
- [ ] All routes render correctly:
  - [ ] `/` (home page)
  - [ ] `/weekly` (weekly news)
  - [ ] `/monthly` (monthly news)
  - [ ] `/about` (about page)
- [ ] JSON data loads from `latest.json`
- [ ] No 404 errors in browser console (except intentional)

## Troubleshooting

### Workflow fails to build

- Check the Actions tab for error logs
- Ensure Node 20 is compatible with all dependencies
- Verify `next.config.mjs` has `output: 'export'`

### Site returns 404

- Verify CNAME file exists in `public/CNAME`
- Check DNS configuration for the custom domain
- Ensure `./out` was uploaded correctly (check Actions artifact)

### Stale content after push

- GitHub Pages CDN may cache; try clearing browser cache
- Force refresh in Actions by using **Run workflow** manually
- Wait up to 5 minutes for CDN to invalidate

### Build succeeds locally but fails in Actions

- Check Node version in workflow (currently 20)
- Verify `package-lock.json` is committed
- Try running `npm ci && npm run build` locally to reproduce

## Static Export Details

QA News uses Next.js 14 static export mode (`output: 'export'` in `next.config.mjs`):
- All pages are pre-rendered to static HTML at build time
- Image optimization is disabled (set `images.unoptimized: true`)
- Trailing slashes are enabled to avoid GitHub Pages 404s
- No server-side rendering or dynamic routes

## Next Steps

Once deployment is stable:
1. Set up scheduled rebuilds if using external PAIOS API (uncomment cron in workflow)
2. Configure branch protection rules to require workflow success before merging
3. Set up deployment notifications (Slack, email, etc.)
