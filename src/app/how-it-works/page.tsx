import Link from 'next/link';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata = {
  title: 'How It Works | QA News Curation Pipeline',
  description:
    'Deep dive into the PAIOS AI pipeline that curates and selects the best QA engineering news daily',
};

export default function HowItWorksPage() {
  return (
    <div className="w-full px-5 py-8 sm:px-8 sm:py-12 bg-gradient-to-br from-paper to-ink-50 dark:from-ink-900 dark:to-ink-800">
      <div className="mx-auto max-w-content">
        {/* Hero Section */}
        <section className="mb-12 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">How PAIOS Curates Your News</h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-2">
            A technical deep dive into the AI-driven curation pipeline
          </p>
          <p className="mt-4">
            <Link href="/about" className="inline-block text-cyan-600 dark:text-cyan-400 hover:underline font-semibold">
              ← Back to About
            </Link>
          </p>
        </section>

        {/* The Pipeline */}
        <section className="mb-12 sm:mb-16 border-l-4 border-cyan-500 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-4 py-2 rounded">
          <h2 className="section-title">The Curation Pipeline</h2>
          <div className="pipeline">
            {[
              {
                step: 1,
                title: 'Ingestion',
                description: '5 feeds tracked · 1,110+ articles fetched daily at 06:00 UTC',
              },
              {
                step: 2,
                title: 'Scoring',
                description: 'AI multi-factor ranking: relevance, freshness, source quality, novelty',
              },
              {
                step: 3,
                title: 'Selection',
                description: 'Top 50 articles ranked by predicted value to QA engineers',
              },
              {
                step: 4,
                title: 'Publication',
                description: 'Static site rebuilt and published at 08:00 UTC daily',
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="pipeline-step flex flex-col items-center justify-center text-center p-4 min-h-[140px]">
                <div className="num">{step}</div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Metrics */}
        <section className="mb-12 sm:mb-16 border-l-4 border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-950 px-4 py-2 rounded">
          <h2 className="section-title">Key Metrics</h2>
          <div className="metrics">
            <div className="metric-card flex flex-col items-center justify-center text-center p-4 min-h-[120px]">
              <p className="label">Feeds Tracked</p>
              <p className="value">5</p>
              <p className="note">OpenAI Blog, Google AI, Cloudflare, Microsoft, Lobsters</p>
            </div>
            <div className="metric-card flex flex-col items-center justify-center text-center p-4 min-h-[120px]">
              <p className="label">Articles Scanned Daily</p>
              <p className="value">1,110</p>
              <p className="note">Aggregate across all sources</p>
            </div>
            <div className="metric-card flex flex-col items-center justify-center text-center p-4 min-h-[120px]">
              <p className="label">Articles Selected Daily</p>
              <p className="value">50</p>
              <p className="note">4.5% selection rate for quality</p>
            </div>
            <div className="metric-card flex flex-col items-center justify-center text-center p-4 min-h-[120px]">
              <p className="label">Update Cycle</p>
              <p className="value" style={{ fontSize: '18px' }}>
                06:00 → 08:00 UTC
              </p>
              <p className="note">Fetch, process, publish daily</p>
            </div>
          </div>
        </section>

        {/* Scoring Factors */}
        <section className="mb-12 sm:mb-16">
          <h2 className="section-title">Scoring Factors</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-base">Relevance</h3>
              <p className="prose mt-2">
                Articles are evaluated for direct applicability to QA engineers, test automation, quality assurance
                practices, and engineering culture.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-base">Freshness</h3>
              <p className="prose mt-2">
                Recent publications score higher. The system prioritizes breaking news and recent developments over
                older content.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-base">Source Quality</h3>
              <p className="prose mt-2">
                Articles from established, authoritative sources receive higher scores. All 5 tracked feeds are
                carefully curated for quality.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-base">Novelty</h3>
              <p className="prose mt-2">
                Unique perspectives and novel insights rank higher. Duplicate or redundant coverage is downranked.
              </p>
            </div>
          </div>
        </section>

        {/* Under the Hood */}
        <section className="mb-12 sm:mb-16">
          <h2 className="section-title">Under the Hood</h2>
          <ul className="prose space-y-4">
            <li>
              <strong>Static site:</strong> Next.js 14 (App Router) built with <code>output: &apos;export&apos;</code>,
              hosted on GitHub Pages with zero server - no runtime backend to fall over.
            </li>
            <li>
              <strong>Read-only by design:</strong> QA News renders what PAIOS already curated. It fetches, never
              edits or removes articles, and contains no business logic or AI execution of its own.
            </li>
            <li>
              <strong>One seam:</strong> every page reads through four functions in <code>src/lib/data.ts</code> -
              Daily Brief, Latest News, Weekly Highlights, Monthly Recaps - so swapping the data source (fixtures
              today, the PAIOS Public API tomorrow) touches nothing else in the app.
            </li>
            <li>
              <strong>Build-time freshness:</strong> data is fetched once at <code>npm run build</code>, not per
              visitor. A GitHub Actions workflow rebuilds the site on every push, with a daily rebuild planned once
              the live API ships - no client-side polling.
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="border-l-4 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-950 px-4 py-6 sm:py-8 rounded">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <FAQAccordion />
        </section>
      </div>
    </div>
  );
}
