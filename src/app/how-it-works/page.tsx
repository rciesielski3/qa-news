import Link from 'next/link';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata = {
  title: 'How It Works | QA News Curation Pipeline',
  description:
    'How QA News collects, scores and publishes QA and test-automation news: a TypeScript pipeline on GitHub Actions with transparent, rule-based ranking.',
};

export default function HowItWorksPage() {
  return (
    <div className="w-full px-5 py-8 sm:px-8 sm:py-12 bg-gradient-to-br from-paper to-ink-50 dark:from-ink-900 dark:to-ink-800">
      <div className="mx-auto max-w-content">
        {/* Hero Section */}
        <section className="mb-12 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">How QA News Curates the News</h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-2">
            A technical look at the pipeline: scheduled fetch, rule-based scoring, de-duplication, daily export
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
                  description: 'A TypeScript job on GitHub Actions fetches the configured RSS and Atom feeds daily at 08:00 UTC',
                },
                {
                  step: 2,
                  title: 'Scoring',
                  description: 'Transparent rules: keyword matches, source weight and a small freshness bonus',
                },
                {
                  step: 3,
                  title: 'De-duplication',
                  description: 'One story per source and normalized URL, kept in a 30-day NDJSON store',
                },
                {
                  step: 4,
                  title: 'Publication',
                  description: 'Exported as JSON to this site once the daily-brief change is merged and tests pass',
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
                <p className="label">Daily Run</p>
                <p className="value">08:00 UTC</p>
                <p className="note">Scheduled GitHub Actions workflow</p>
              </div>
              <div className="metric-card flex flex-col items-center justify-center text-center p-4 min-h-[120px]">
                <p className="label">Retention</p>
                <p className="value">30 days</p>
                <p className="note">Older articles are pruned from the store and the export</p>
              </div>
              <div className="metric-card flex flex-col items-center justify-center text-center p-4 min-h-[120px]">
                <p className="label">Top Picks</p>
                <p className="value">3 per period</p>
                <p className="note">Highest score in today, week and month views</p>
              </div>
              <div className="metric-card flex flex-col items-center justify-center text-center p-4 min-h-[120px]">
                <p className="label">New Repos Window</p>
                <p className="value">60 days</p>
                <p className="note">GitHub repos with 50+ stars</p>
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
                  title: 'Topic Keywords',
                  description: 'Every score starts from a base of 50. Each QA or testing keyword found in the title or summary (test automation, e2e testing, security testing, Playwright and others) adds a fixed weight.'
                },
                {
                  title: 'Source Weight',
                  description: 'The scoring config can add a weight per source, so primary QA and testing publications can outrank general engineering feeds.'
                },
                {
                  title: 'Freshness',
                  description: 'Articles under 24 hours old get a small bonus of up to 4 points. Older articles simply do not get the bonus.'
                },
                {
                  title: 'Off-Topic Filter',
                  description: 'Articles about hardware or networking topics are dropped unless they also mention testing or QA terms.'
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
                  description: 'The daily-brief workflow runs at 08:00 UTC. It fetches each feed (failing feeds are skipped, not fatal), normalizes the items, scores them and appends them to an NDJSON store versioned in Git.'
                },
                {
                  title: 'De-duplication',
                  description: 'A story is identified by its source plus its URL with fragments and utm_ tracking parameters removed. Re-seen articles keep their original ID, and the export fails loudly if two different URLs ever share an ID.'
                },
                {
                  title: 'Export and Windows',
                  description: 'The site reads one latest.json holding the last 30 days. Today, Weekly and Monthly are views of that file, and each shows its own top three picks by score, newest first on ties.'
                },
                {
                  title: 'New & Notable Repos',
                  description: 'A separate export queries the GitHub search API for repos tagged test-automation, e2e-testing or ai-testing, created in the last 60 days with at least 50 stars. The Daily page shows up to six. Stars are a snapshot, not a growth rate.'
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
