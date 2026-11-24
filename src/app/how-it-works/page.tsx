import Link from 'next/link';
import { FactChips } from '@/components/ContentBits';
import ContentCtas from '@/components/ContentCtas';
import ContentTile from '@/components/ContentTile';
import FAQAccordion from '@/components/FAQAccordion';
import ScoreBreakdown from '@/components/ScoreBreakdown';
import SectionHead from '@/components/SectionHead';
import SectionNav, { type SectionNavItem } from '@/components/SectionNav';

export const metadata = {
  title: 'How It Works | QA News Curation Pipeline',
  description:
    'How QA News collects, scores and publishes QA and test-automation news: a TypeScript pipeline on GitHub Actions with transparent, rule-based ranking.',
};

const NAV_ITEMS: SectionNavItem[] = [
  { id: 'pipeline', no: '01', label: 'Pipeline' },
  { id: 'scoring', no: '02', label: 'Scoring' },
  { id: 'numbers', no: '03', label: 'Key numbers' },
  { id: 'faq', no: '04', label: 'FAQ' },
];

const STEPS = [
  {
    step: 1,
    title: 'Ingestion',
    description: 'Daily at 08:00 UTC on GitHub Actions; a failing feed is skipped, not fatal',
    icon: <path d="M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8M6 18h.01" />,
  },
  {
    step: 2,
    title: 'Scoring',
    description: 'Keyword matches, source weight and a small freshness bonus',
    icon: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  },
  {
    step: 3,
    title: 'De-duplication',
    description: 'One story per source and normalized URL, stored in Git as 30-day NDJSON',
    icon: <path d="M3 5h18l-7 8v6l-4 2v-8z" />,
  },
  {
    step: 4,
    title: 'Publication',
    description: 'Exported as JSON to this site once the change is merged and tests pass',
    icon: <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4M12 15V3M7 8l5-5 5 5" />,
  },
];

const NUMBERS = [
  { label: 'Daily run', value: '08:00 UTC' },
  { label: 'Retention', value: '30 days' },
  { label: 'Top picks', value: '3 per period' },
  { label: 'New repos, 60 days', value: '50+ stars' },
];

const RULES = [
  { name: 'Keyword match', text: 'Case-insensitive on title and summary; each distinct keyword counts once.' },
  { name: 'Source prior', text: 'Up to +10 for a few primary QA sources. Nudges, never decides.' },
  { name: 'Off-topic filter', text: 'Hardware and networking items are dropped unless they also mention testing or QA.' },
];

export default function HowItWorksPage() {
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
                  How it works
                </div>
                <h1>
                  How QA News <em>Curates</em> the News
                </h1>
                <p>Scheduled fetch, rule-based scoring, de-duplication, daily export.</p>
                <FactChips items={['Daily at 08:00 UTC', 'Rule-based scoring', 'NDJSON in Git', '30-day window']} label="Key facts" />
              </div>
              <div className="cta">
                <Link className="btn ghost" href="/about#architecture">
                  Read the case study <span aria-hidden="true">→</span>
                </Link>
              </div>
            </ContentTile>
          </div>
        </div>
      </div>

      <SectionNav items={NAV_ITEMS} />

      {/* 01 Pipeline */}
      <section id="pipeline" className="sec first" aria-labelledby="pipeline-title">
        <div className="wrap">
          <SectionHead no="01" eyebrow="Pipeline" title="Pipeline" titleId="pipeline-title" />
          <ol className="cp-steps" role="list">
            {STEPS.map(({ step, title, description, icon }, i) => (
              <li key={step}>
                <ContentTile className="cp-step hov" index={i}>
                  <span className="ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      {icon}
                    </svg>
                  </span>
                  <span className="no tnum" aria-hidden="true">
                    {String(step).padStart(2, '0')}
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </ContentTile>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 02 Scoring */}
      <section id="scoring" className="sec band" aria-labelledby="scoring-title">
        <div className="wrap">
          <SectionHead no="02" eyebrow="Scoring" title="Scoring" titleId="scoring-title" />
          <ScoreBreakdown />
          <ContentTile className="cp-rules-tile" index={1}>
            <ul className="cp-rules" role="list">
              {RULES.map(({ name, text }) => (
                <li key={name}>
                  <b>{name}</b> {text}
                </li>
              ))}
            </ul>
          </ContentTile>
        </div>
      </section>

      {/* 03 Key numbers */}
      <section id="numbers" className="sec" aria-labelledby="numbers-title">
        <div className="wrap">
          <SectionHead no="03" eyebrow="Numbers" title="Key numbers" titleId="numbers-title" />
          <div className="cp-grid cp-metrics">
            {NUMBERS.map(({ label, value }, i) => (
              <ContentTile key={label} className="cp-metric hov" index={i}>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  {label}
                </div>
                <p className="v tnum">{value}</p>
              </ContentTile>
            ))}
          </div>
        </div>
      </section>

      {/* 04 FAQ */}
      <section id="faq" className="sec band" aria-labelledby="faq-title">
        <div className="wrap">
          <SectionHead no="04" eyebrow="FAQ" title="FAQ" titleId="faq-title" />
          <FAQAccordion />
        </div>
      </section>

      {/* Back to the period pages */}
      <section className="sec" aria-label="Browse the news">
        <div className="wrap">
          <div className="cp-ctas">
            <ContentCtas />
          </div>
        </div>
      </section>
    </div>
  );
}
