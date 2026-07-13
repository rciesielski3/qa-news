// Static export config for GitHub Pages.
//
// Deployed at qa-news.rciesielski.dev (see public/CNAME) — a custom domain
// serves from the root, so NEXT_BASE_PATH stays empty by default. It only
// needs setting if this ever falls back to the default GH Pages project
// path (username.github.io/qa-news) without a custom domain.
const repoBasePath = process.env.NEXT_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: repoBasePath,
  assetPrefix: repoBasePath ? `${repoBasePath}/` : undefined,
  images: {
    unoptimized: true, // next/image's optimizer needs a server; GH Pages is static-only
  },
  trailingSlash: true, // avoids GH Pages 404s on /weekly -> /weekly/index.html
};

export default nextConfig;
