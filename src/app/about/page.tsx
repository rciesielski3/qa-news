export const metadata = {
  title: 'About QA News | How PAIOS Curates',
  description: 'Learn how PAIOS AI pipeline selects and curates news for QA engineers',
};

export default function AboutPage() {
  return (
    <div className="w-full px-5 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-content">
          {/* Hero Section */}
          <section className="mb-12 sm:mb-16 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-paper">How PAIOS Curates News</h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-paper-muted">Your personal AI news curator for QA engineers</p>
          </section>

          {/* Pipeline Visualization */}
          <section className="mb-12 sm:mb-16">
            <h2 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold text-paper">The Curation Pipeline</h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: 1,
                  title: 'Ingestion',
                  description: '5 feeds tracked · 1,110+ articles fetched daily at 06:00 UTC',
                },
                {
                  step: 2,
                  title: 'Scoring',
                  description: 'AI multi-factor ranking: relevance, freshness, quality, novelty',
                },
                {
                  step: 3,
                  title: 'Selection',
                  description: 'Top 50 articles ranked by predicted value to you',
                },
                {
                  step: 4,
                  title: 'Publication',
                  description: 'Updated and published at 08:00 UTC daily',
                },
              ].map(({ step, title, description }) => (
                <div key={step} className="rounded border border-ink-600 bg-ink-800 p-4 sm:p-6">
                  <div className="mb-3 inline-block rounded-full bg-signal-info px-3 py-1.5 text-white font-bold text-sm">
                    {step}
                  </div>
                  <h3 className="mb-2 text-base sm:text-lg font-semibold text-paper">{title}</h3>
                  <p className="text-sm text-paper-muted">{description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Key Metrics */}
          <section className="mb-12 sm:mb-16">
            <h2 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold text-paper">Key Metrics</h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              <div className="rounded border border-ink-600 bg-ink-800 p-4 sm:p-6">
                <p className="text-xs sm:text-sm font-medium text-paper-muted">Feeds Tracked</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-paper">5</p>
                <p className="mt-2 text-xs sm:text-sm text-paper-muted">
                  OpenAI Blog, Google AI, Cloudflare, Microsoft, Lobsters
                </p>
              </div>
              <div className="rounded border border-ink-600 bg-ink-800 p-4 sm:p-6">
                <p className="text-xs sm:text-sm font-medium text-paper-muted">Articles Scanned Daily</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-paper">1,110</p>
                <p className="mt-2 text-xs sm:text-sm text-paper-muted">Aggregate across all sources</p>
              </div>
              <div className="rounded border border-ink-600 bg-ink-800 p-4 sm:p-6">
                <p className="text-xs sm:text-sm font-medium text-paper-muted">Articles Selected Daily</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-paper">50</p>
                <p className="mt-2 text-xs sm:text-sm text-paper-muted">4.5% selection rate for quality</p>
              </div>
              <div className="rounded border border-ink-600 bg-ink-800 p-4 sm:p-6">
                <p className="text-xs sm:text-sm font-medium text-paper-muted">Update Cycle</p>
                <p className="mt-2 text-base sm:text-lg font-bold text-paper">06:00 → 08:00 UTC</p>
                <p className="mt-2 text-xs sm:text-sm text-paper-muted">Fetch, process, publish daily</p>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12 sm:mb-16">
            <h2 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold text-paper">How to Use</h2>
            <ul className="space-y-4 text-paper-muted text-sm">
              <li>
                <strong className="text-paper">Click tags/categories</strong> to filter by topic. Mix and match to discover articles you care about.
              </li>
              <li>
                <strong className="text-paper">Browse Daily Brief</strong> for handpicked top 6 articles (marked "Top Pick").
              </li>
              <li>
                <strong className="text-paper">Scroll Latest News</strong> for all 50 selected articles in reverse chronological order.
              </li>
              <li>
                <strong className="text-paper">Check back daily</strong> for fresh picks. New articles arrive at 08:00 UTC.
              </li>
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold text-paper">FAQ</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-paper text-base">Why only 50 articles?</h3>
                <p className="mt-2 text-paper-muted text-sm">
                  Quality over quantity. The AI filters aggressively for signal, removing noise. You get the best 4.5% of articles instead of information overload.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-paper text-base">How are articles selected?</h3>
                <p className="mt-2 text-paper-muted text-sm">
                  Multi-factor AI scoring: relevance to QA engineers, freshness, source quality, and novelty. Articles must rank highly across all factors.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-paper text-base">Can I request sources?</h3>
                <p className="mt-2 text-paper-muted text-sm">
                  Not yet — this is a planned feature. For now, the 5 feeds are curated for quality and relevance.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
}
