import Link from 'next/link';

export const metadata = {
  title: 'About QA News',
  description: 'QA News is a personal AI news curator built for QA engineers — what it is and why it exists.',
};

export default function AboutPage() {
  return (
    <div className="w-full px-5 py-8 sm:px-8 sm:py-12 bg-gradient-to-br from-paper to-ink-50 dark:from-ink-900 dark:to-ink-800">
      <div className="mx-auto max-w-content">
        {/* Hero Section */}
        <section className="mb-12 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">About QA News</h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-2">Your personal AI news curator for QA engineers</p>
        </section>

        {/* Description */}
        <section className="mb-12 sm:mb-16 border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950 px-4 py-6 sm:py-8 rounded">
          <h2 className="section-title">What Is QA News</h2>
          <p className="prose mt-2">
            QA News is a read-only view over the PAIOS Knowledge Layer - a daily digest built specifically for QA
            engineers, test automation practitioners, and quality-focused engineering teams. Instead of scrolling
            through dozens of feeds and newsletters, you get a single curated stream: the handful of articles each
            day that are actually worth your time.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-12 sm:mb-16 border-l-4 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-950 px-4 py-6 sm:py-8 rounded">
          <h2 className="section-title">Our Mission</h2>
          <p className="prose mt-2">
            Engineering news is abundant; attention is not. Our mission is to cut through the noise and surface only
            what genuinely matters to QA and quality engineering — so you can stay current without spending your day
            triaging feeds. Quality over quantity, every single day.
          </p>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Link
            href="/how-it-works"
            className="inline-block text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
          >
            Learn about our pipeline →
          </Link>
        </section>
      </div>
    </div>
  );
}
