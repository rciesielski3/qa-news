import Link from 'next/link';
import ContentTile from '@/components/ContentTile';
import ContentCtas from '@/components/ContentCtas';
import SectionHead from '@/components/SectionHead';

export const metadata = {
  title: 'About QA News',
  description: 'QA News is a personal AI news curator built for QA engineers - what it is and why it exists.',
};

export default function AboutPage() {
  return (
    <div className="home content-page">
      {/* Hero */}
      <div className="hero">
        <div className="wrap">
          <div className="bento">
            <ContentTile className="t-head cp-head" index={0} pauseOffscreen>
              <div>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  About
                </div>
                <h1>
                  About <em>QA News</em>
                </h1>
                <p>Your personal AI news curator for QA engineers</p>
              </div>
              <div className="cta">
                <Link className="btn" href="/how-it-works">
                  Learn about our pipeline <span aria-hidden="true">→</span>
                </Link>
              </div>
            </ContentTile>
          </div>
        </div>
      </div>

      {/* 01 What it is */}
      <section id="what" className="sec first" aria-labelledby="what-title">
        <div className="wrap">
          <SectionHead no="01" eyebrow="About" title="What Is QA News" titleId="what-title" />
          <ContentTile className="cp-prose" index={0}>
            <p className="prose">
              QA News is a daily digest for QA engineers, test automation practitioners, and quality-focused
              engineering teams. A TypeScript pipeline on GitHub Actions collects testing and engineering feeds,
              ranks them with transparent rules, and publishes the result here. Instead of scrolling through dozens
              of feeds and newsletters, you get a single curated stream with the strongest items of each period on top.
            </p>
          </ContentTile>
        </div>
      </section>

      {/* 02 Mission */}
      <section id="mission" className="sec band" aria-labelledby="mission-title">
        <div className="wrap">
          <SectionHead no="02" eyebrow="Mission" title="Our Mission" titleId="mission-title" />
          <ContentTile className="cp-prose" index={0}>
            <p className="prose">
              Engineering news is abundant; attention is not. Our mission is to cut through the noise and surface only
              what genuinely matters to QA and quality engineering - so you can stay current without spending your day
              triaging feeds. Quality over quantity, every single day.
            </p>
          </ContentTile>
        </div>
      </section>

      {/* Contact + next steps */}
      <section className="sec" aria-label="Feedback and next steps">
        <div className="wrap">
          <div className="cp-ctas">
            <ContentTile className="cp-cta hov" index={0}>
              <div className="tlabel">
                <span className="dot" aria-hidden="true" />
                Feedback
              </div>
              <p className="cp-cta-text">
                Have feedback?{' '}
                <a
                  href="https://rciesielski.dev/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cp-link"
                >
                  Suggest improvements
                </a>
              </p>
            </ContentTile>
            <ContentCtas startIndex={1} />
          </div>
        </div>
      </section>
    </div>
  );
}
