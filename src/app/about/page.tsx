export const metadata = {
  title: 'About QA News | How PAIOS Curates',
  description: 'Learn how PAIOS AI pipeline selects and curates news for QA engineers',
};

export default function AboutPage() {
  return (
    <div className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Hero Section */}
          <section className="mb-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">How PAIOS Curates News</h1>
            <p className="mt-4 text-xl text-gray-600">Your personal AI news curator for QA engineers</p>
          </section>

          {/* Pipeline Visualization */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">The Curation Pipeline</h2>
            <div className="grid gap-8 md:grid-cols-4">
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
                <div key={step} className="rounded border border-gray-200 bg-gray-50 p-6">
                  <div className="mb-3 inline-block rounded-full bg-blue-500 px-4 py-2 text-white font-bold">
                    {step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Key Metrics */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">Key Metrics</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded border border-gray-200 bg-white p-6">
                <p className="text-sm font-medium text-gray-500">Feeds Tracked</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">5</p>
                <p className="mt-2 text-sm text-gray-600">
                  OpenAI Blog, Google AI, Cloudflare, Microsoft, Lobsters
                </p>
              </div>
              <div className="rounded border border-gray-200 bg-white p-6">
                <p className="text-sm font-medium text-gray-500">Articles Scanned Daily</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">1,110</p>
                <p className="mt-2 text-sm text-gray-600">Aggregate across all sources</p>
              </div>
              <div className="rounded border border-gray-200 bg-white p-6">
                <p className="text-sm font-medium text-gray-500">Articles Selected Daily</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">50</p>
                <p className="mt-2 text-sm text-gray-600">4.5% selection rate for quality</p>
              </div>
              <div className="rounded border border-gray-200 bg-white p-6">
                <p className="text-sm font-medium text-gray-500">Update Cycle</p>
                <p className="mt-2 text-lg font-bold text-gray-900">06:00 → 08:00 UTC</p>
                <p className="mt-2 text-sm text-gray-600">Fetch, process, publish daily</p>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">How to Use</h2>
            <ul className="max-content space-y-4 text-gray-700">
              <li>
                <strong>Click tags/categories</strong> to filter by topic. Mix and match to discover articles you care about.
              </li>
              <li>
                <strong>Browse Daily Brief</strong> for handpicked top 6 articles (marked "Top Pick").
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
            <h2 className="mb-8 text-2xl font-bold text-gray-900">FAQ</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900">Why only 50 articles?</h3>
                <p className="mt-2 text-gray-700">
                  Quality over quantity. The AI filters aggressively for signal, removing noise. You get the best 4.5% of articles instead of information overload.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">How are articles selected?</h3>
                <p className="mt-2 text-gray-700">
                  Multi-factor AI scoring: relevance to QA engineers, freshness, source quality, and novelty. Articles must rank highly across all factors.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Can I request sources?</h3>
                <p className="mt-2 text-gray-700">
                  Not yet — this is a planned feature. For now, the 5 feeds are curated for quality and relevance.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
}
