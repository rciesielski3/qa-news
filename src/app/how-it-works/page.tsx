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
          <div className="section-content-wrapper">
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
                  <h3 className="font-semibold text-lg my-2">{title}</h3>
                  <p className="text-sm">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="mb-12 sm:mb-16 border-l-4 border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-950 px-4 py-2 rounded">
          <div className="section-content-wrapper">
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
          </div>
        </section>

        {/* Scoring Factors */}
        <section className="mb-12 sm:mb-16">
          <div className="section-content-wrapper">
            <h2 className="section-title mb-6">Scoring Factors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Relevance',
                  description: 'Articles are ranked by predicted value to QA engineers based on keywords, topics, and historical engagement.'
                },
                {
                  title: 'Freshness',
                  description: 'Recent articles receive a boost to ensure you see the latest news and developments in the field.'
                },
                {
                  title: 'Source Quality',
                  description: 'Feeds are pre-curated for reliability and expertise. Higher-quality sources receive higher rankings.'
                },
                {
                  title: 'Novelty',
                  description: 'Articles covering new topics or unique angles rank higher than duplicates or rehashes of recent news.'
                },
              ].map((factor) => (
                <div key={factor.title} className="border border-ink-200 dark:border-ink-600 rounded p-4 bg-ink-50 dark:bg-ink-900">
                  <h3 className="font-semibold text-ink-800 dark:text-paper mb-2">{factor.title}</h3>
                  <p className="text-sm text-ink-600 dark:text-paper-muted">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Under the Hood */}
        <section className="mb-12 sm:mb-16">
          <div className="section-content-wrapper">
            <h2 className="section-title mb-6">Under the Hood</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Data Pipeline',
                  description: 'Feeds are fetched at 06:00 UTC daily. Articles are scored during the next two hours using multi-factor AI ranking.'
                },
                {
                  title: 'Selection Algorithm',
                  description: 'The top 50 articles (4.5% of ~1,110 fetched) are selected based on combined relevance, freshness, quality, and novelty scores.'
                },
                {
                  title: 'Daily Refresh',
                  description: 'Results are published at 08:00 UTC daily to the QA News website. Fresh picks are ready every morning for your review.'
                },
                {
                  title: 'Quality Metrics',
                  description: 'The pipeline tracks 5 RSS feeds covering 1,110+ articles daily. An 4.5% selection rate ensures only the best make the cut.'
                },
              ].map((concept) => (
                <div key={concept.title} className="border border-ink-200 dark:border-ink-600 rounded p-4 bg-ink-50 dark:bg-ink-900">
                  <h3 className="font-semibold text-ink-800 dark:text-paper mb-2">{concept.title}</h3>
                  <p className="text-sm text-ink-600 dark:text-paper-muted">{concept.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-l-4 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-950 px-4 py-8 sm:py-12 rounded">
          <div className="section-content-wrapper">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="w-full px-4 sm:px-6 -mx-4 sm:-mx-6">
              <FAQAccordion />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
