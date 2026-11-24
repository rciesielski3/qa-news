import Link from 'next/link';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import { FactChips } from '@/components/ContentBits';
import ContentCtas from '@/components/ContentCtas';
import ContentTile from '@/components/ContentTile';
import SectionHead from '@/components/SectionHead';

export const metadata = {
  title: 'About QA News | Case study',
  description:
    'QA News is an automated, rule-based news curator for QA and test-automation engineers: architecture, key decisions, stack and quality gates.',
};

const FACTS = ['Static site', 'Rule-based ranking', 'Git-versioned data', '30-day window'];

const DECISIONS = [
  { title: 'Git as the datastore', text: 'NDJSON next to the code: history, review and rollback for free, no database to run.' },
  { title: 'Transparent scoring, no LLM', text: 'Keyword, source and freshness rules: explainable, free to run, no external API.' },
  { title: 'PR-gated automation', text: 'The daily run opens a pull request and merges only after the tests pass.' },
  {
    title: 'Deterministic de-duplication',
    text: 'A story is its source plus URL, minus tracking parameters; the export fails on ID collisions.',
  },
  { title: 'Static export', text: 'A pre-built site on GitHub Pages: no server to patch, scale or pay for.' },
];

const STACK = [
  'TypeScript',
  'Node.js',
  'rss-parser',
  'NDJSON',
  'Next.js 14',
  'React 18',
  'Tailwind CSS',
  'Jest',
  'Testing Library',
  'GitHub Actions',
  'GitHub Pages',
];

const QUALITY = [
  'Unit, integration, e2e and workflow tests',
  'Lint',
  'Typecheck',
  'Format check',
  'Coverage floor',
  'npm audit',
  'gitleaks',
  'Contrast tests (WCAG, both themes)',
  'Reduced-motion support',
];

export default function AboutPage() {
  return (
    <div className="home content-page">
      {/* Overview / hero */}
      <div className="hero">
        <div className="wrap">
          <div className="bento">
            <ContentTile className="t-head cp-head" index={0} pauseOffscreen>
              <div>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  Case study
                </div>
                <h1>
                  About <em>QA News</em>
                </h1>
                <p>An automated, rule-based news curator for QA and test-automation engineers.</p>
                <FactChips items={FACTS} label="Key facts" />
              </div>
              <div className="cta">
                <Link className="btn" href="/how-it-works">
                  How it works <span aria-hidden="true">→</span>
                </Link>
                <a className="btn ghost" href="#architecture">
                  Architecture
                </a>
              </div>
            </ContentTile>
          </div>
        </div>
      </div>

      {/* 01 Architecture */}
      <section id="architecture" className="sec first" aria-labelledby="architecture-title">
        <div className="wrap">
          <SectionHead no="01" eyebrow="Architecture" title="From feed to page" titleId="architecture-title" />
          <ArchitectureDiagram />
        </div>
      </section>

      {/* 02 Key decisions */}
      <section id="decisions" className="sec band" aria-labelledby="decisions-title">
        <div className="wrap">
          <SectionHead no="02" eyebrow="Decisions" title="Key decisions" titleId="decisions-title" />
          <ul className="cp-rows" role="list">
            {DECISIONS.map(({ title, text }, i) => (
              <li key={title}>
                <ContentTile className="cp-row hov" index={i}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </ContentTile>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 Stack and quality */}
      <section id="stack" className="sec" aria-labelledby="stack-title">
        <div className="wrap">
          <SectionHead no="03" eyebrow="Stack" title="Stack and quality" titleId="stack-title" />
          <ContentTile className="cp-card" index={0}>
            <div className="tlabel">
              <span className="dot" aria-hidden="true" />
              Stack
            </div>
            <ul className="cp-tags" role="list" aria-label="Stack">
              {STACK.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="tlabel">
              <span className="dot" aria-hidden="true" />
              Quality gates
            </div>
            <ul className="cp-tags" role="list" aria-label="Quality gates">
              {QUALITY.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ContentTile>
        </div>
      </section>

      {/* Contact + next steps */}
      <section className="sec band" aria-label="Feedback and next steps">
        <div className="wrap">
          <div className="cp-ctas">
            <ContentTile className="cp-cta hov" index={0}>
              <div className="tlabel">
                <span className="dot" aria-hidden="true" />
                Feedback
              </div>
              <p className="cp-cta-text">
                <a
                  href="https://rciesielski.dev/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cp-link"
                >
                  Get in touch
                  <span className="sr-only"> (opens in new tab)</span>
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
