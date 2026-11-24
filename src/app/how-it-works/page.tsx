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
  { id: 'metrics', no: '02', label: 'Key metrics' },
  { id: 'scoring', no: '03', label: 'Scoring' },
  { id: 'hood', no: '04', label: 'Under the hood' },
  { id: 'faq', no: '05', label: 'FAQ' },
];

const STEPS = [
  {
    step: 1,
    title: 'Ingestion',
    description: 'A TypeScript job on GitHub Actions fetches the configured RSS and Atom feeds daily at 08:00 UTC',
    icon: <path d="M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8M6 18h.01" />,
  },
  {
    step: 2,
    title: 'Scoring',
    description: 'Transparent rules: keyword matches, source weight and a small freshness bonus',
    icon: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  },
  {
    step: 3,
    title: 'De-duplication',
    description: 'One story per source and normalized URL, kept in a 30-day NDJSON store',
    icon: <path d="M3 5h18l-7 8v6l-4 2v-8z" />,
  },
  {
    step: 4,
    title: 'Publication',
    description: 'Exported as JSON to this site once the daily-brief change is merged and tests pass',
    icon: <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4M12 15V3M7 8l5-5 5 5" />,
  },
];

const METRICS = [
  { label: 'Daily Run', value: '08:00 UTC', note: 'Scheduled GitHub Actions workflow' },
  { label: 'Retention', value: '30 days', note: 'Older articles are pruned from the store and the export' },
  { label: 'Top Picks', value: '3 per period', note: 'Highest score in today, week and month views' },
  { label: 'New Repos Window', value: '60 days', note: 'GitHub repos with 50+ stars' },
];

const RULES = [
  {
    title: 'How keywords match',
    description:
      'Keywords are matched case-insensitively against the title and summary. Each distinct keyword found adds its weight once, and the matched keywords are recorded as the reasons for the score.',
  },
  {
    title: 'Source prior',
    description:
      'A few primary QA and testing sources carry a small prior. Source names are matched case-insensitively as substrings. It nudges the ranking and never decides it.',
  },
  {
    title: 'Off-topic filter',
    description:
      'Articles about hardware or networking topics are dropped unless they also mention testing or QA terms.',
  },
];

const CONCEPTS = [
  {
    title: 'Data Pipeline',
    description:
      'The daily-brief workflow runs at 08:00 UTC. It fetches each feed (failing feeds are skipped, not fatal), normalizes the items, scores them and appends them to an NDJSON store versioned in Git.',
  },
  {
    title: 'De-duplication',
    description:
      'A story is identified by its source plus its URL with fragments and utm_ tracking parameters removed. Re-seen articles keep their original ID, and the export fails loudly if two different URLs ever share an ID.',
  },
  {
    title: 'Export and Windows',
    description:
      'The site reads one latest.json holding the last 30 days. Today, Weekly and Monthly are views of that file, and each shows its own top three picks by score, newest first on ties.',
  },
  {
    title: 'New & Notable Repos',
    description:
      'A separate export queries the GitHub search API for repos tagged test-automation, e2e-testing or ai-testing, created in the last 60 days with at least 50 stars. The Daily page shows up to six. Stars are a snapshot, not a growth rate.',
  },
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
                <p>
                  A technical look at the pipeline: scheduled fetch, rule-based scoring, de-duplication, daily export
                </p>
                <FactChips items={['Daily at 08:00 UTC', 'Rule-based scoring', 'NDJSON in Git', '30-day window']} label="Key facts" />
              </div>
              <div className="cta">
                <Link className="btn ghost" href="/about">
                  <span aria-hidden="true">←</span> Read the case study
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
          <SectionHead no="01" eyebrow="Pipeline" title="The Curation Pipeline" titleId="pipeline-title" />
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

      {/* 02 Key metrics */}
      <section id="metrics" className="sec band" aria-labelledby="metrics-title">
        <div className="wrap">
          <SectionHead no="02" eyebrow="Metrics" title="Key Metrics" titleId="metrics-title" />
          <div className="cp-grid cp-metrics">
            {METRICS.map(({ label, value, note }, i) => (
              <ContentTile key={label} className="cp-metric hov" index={i}>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  {label}
                </div>
                <p className="v tnum">{value}</p>
                <p className="n">{note}</p>
              </ContentTile>
            ))}
          </div>
        </div>
      </section>

      {/* 03 Scoring factors */}
      <section id="scoring" className="sec" aria-labelledby="scoring-title">
        <div className="wrap">
          <SectionHead
            no="03"
            eyebrow="Scoring"
            title="Scoring Factors"
            titleId="scoring-title"
            sub="A score is a sum of a few readable parts. Keyword relevance does most of the work."
          />
          <ScoreBreakdown />
          <div className="cp-grid cp-three cp-after">
            {RULES.map(({ title, description }, i) => (
              <ContentTile key={title} className="cp-card hov" index={i}>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  <span className="tnum">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </ContentTile>
            ))}
          </div>
        </div>
      </section>

      {/* 04 Under the hood */}
      <section id="hood" className="sec band" aria-labelledby="hood-title">
        <div className="wrap">
          <SectionHead
            no="04"
            eyebrow="Internals"
            title="Under the Hood"
            titleId="hood-title"
            sub="The mechanics. For the system view and the reasoning behind it, see the case study."
          />
          <div className="cp-grid cp-cards">
            {CONCEPTS.map(({ title, description }, i) => (
              <ContentTile key={title} className="cp-card hov" index={i}>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  <span className="tnum">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </ContentTile>
            ))}
          </div>
        </div>
      </section>

      {/* 05 FAQ */}
      <section id="faq" className="sec" aria-labelledby="faq-title">
        <div className="wrap">
          <SectionHead no="05" eyebrow="FAQ" title="Frequently Asked Questions" titleId="faq-title" />
          <FAQAccordion />
          <p className="cp-note">
            Looking for the why? The <Link href="/about#architecture">architecture and engineering decisions</Link> are
            on the About page.
          </p>
        </div>
      </section>

      {/* Back to the period pages */}
      <section className="sec band" aria-label="Browse the news">
        <div className="wrap">
          <div className="cp-ctas">
            <ContentCtas />
          </div>
        </div>
      </section>
    </div>
  );
}
