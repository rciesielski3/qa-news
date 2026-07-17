export const metadata = {
  title: 'About QA News | How PAIOS Curates',
  description: 'Learn how PAIOS AI pipeline selects and curates news for QA engineers',
};

export default function AboutPage() {
  return (
    <div className="w-full px-5 py-8 sm:px-8 sm:py-12 bg-gradient-to-br from-paper to-ink-50 dark:from-ink-900 dark:to-ink-800">
        <div className="mx-auto max-w-content">
          {/* Hero Section */}
          <section className="mb-12 sm:mb-16 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">How PAIOS Curates News</h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-2">Your personal AI news curator for QA engineers</p>
          </section>

          {/* Pipeline Visualization */}
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
                <div key={step} className="pipeline-step">
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
              <div className="metric-card">
                <p className="label">Feeds Tracked</p>
                <p className="value">5</p>
                <p className="note">OpenAI Blog, Google AI, Cloudflare, Microsoft, Lobsters</p>
              </div>
              <div className="metric-card">
                <p className="label">Articles Scanned Daily</p>
                <p className="value">1,110</p>
                <p className="note">Aggregate across all sources</p>
              </div>
              <div className="metric-card">
                <p className="label">Articles Selected Daily</p>
                <p className="value">50</p>
                <p className="note">4.5% selection rate for quality</p>
              </div>
              <div className="metric-card">
                <p className="label">Update Cycle</p>
                <p className="value" style={{ fontSize: '18px' }}>06:00 → 08:00 UTC</p>
                <p className="note">Fetch, process, publish daily</p>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12 sm:mb-16">
            <h2 className="section-title">How to Use</h2>
            <ul className="prose space-y-4">
              <li>
                <strong>Click tags/categories</strong> to filter by topic. Mix and match to discover articles you care about.
              </li>
              <li>
                <strong>Browse Daily Brief</strong> for handpicked top 6 articles (marked &quot;Top Pick&quot;).
              </li>
              <li>
                <strong>Scroll Latest News</strong> for all 50 selected articles in reverse chronological order.
              </li>
              <li>
                <strong>Check back daily</strong> for fresh picks. New articles arrive at 08:00 UTC.
              </li>
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="section-title">FAQ</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-base">Why only 50 articles?</h3>
                <p className="prose mt-2">
                  Quality over quantity. The AI filters aggressively for signal, removing noise. You get the best 4.5% of articles instead of information overload.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-base">How are articles selected?</h3>
                <p className="prose mt-2">
                  Multi-factor AI scoring: relevance to QA engineers, freshness, source quality, and novelty. Articles must rank highly across all factors.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-base">Can I request sources?</h3>
                <p className="prose mt-2">
                  Not yet — this is a planned feature. For now, the 5 feeds are curated for quality and relevance.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
}
