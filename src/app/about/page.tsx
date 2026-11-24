import Link from 'next/link';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import { FactChips, StatusPill } from '@/components/ContentBits';
import ContentCtas from '@/components/ContentCtas';
import ContentTile from '@/components/ContentTile';
import SectionHead from '@/components/SectionHead';
import SectionNav, { type SectionNavItem } from '@/components/SectionNav';

export const metadata = {
  title: 'About QA News | Case study',
  description:
    'QA News is an automated, rule-based news curator for QA and test-automation engineers: the problem, the architecture, the engineering decisions and the quality bar.',
};

const NAV_ITEMS: SectionNavItem[] = [
  { id: 'problem', no: '01', label: 'Problem' },
  { id: 'solution', no: '02', label: 'Solution' },
  { id: 'architecture', no: '03', label: 'Architecture' },
  { id: 'decisions', no: '04', label: 'Decisions' },
  { id: 'quality', no: '05', label: 'Quality' },
  { id: 'stack', no: '06', label: 'Stack' },
  { id: 'next', no: '07', label: 'Next' },
];

const FACTS = ['Static site', 'Rule-based ranking', 'Git-versioned data', '30-day window'];

const PROBLEMS = [
  {
    title: 'Too many places to look',
    text: 'QA and test-automation news is spread across vendor blogs, practitioner sites and tool release feeds. Reading them all is a job in itself.',
  },
  {
    title: 'Noise inside the signal',
    text: 'General engineering feeds carry hardware and networking posts next to testing news, and some sites mix in glossary and job pages. None of that is news for a QA engineer.',
  },
  {
    title: 'The same story twice',
    text: 'Feeds repeat items under different tracking parameters. Without a stable story identity, one article shows up several times.',
  },
];

const SOLUTION = [
  {
    title: 'Collect',
    text: 'A scheduled job reads a curated list of RSS and Atom feeds. A feed that fails is skipped, not fatal.',
  },
  {
    title: 'Rank',
    text: 'Fixed rules score every article from its text, source and age. Off-topic items are filtered. The rules are readable code, not a model.',
  },
  {
    title: 'Publish',
    text: 'The result is one 30-day JSON file. Daily, Weekly and Monthly are views of it, each with its own top three picks.',
  },
];

const DECISIONS = [
  {
    title: 'Git as the datastore',
    why: 'Articles live in an NDJSON file next to the code. History, review and rollback come for free, and there is no database to run.',
    tradeoff: 'No query engine. One daily job writes the file, guarded by a file lock, and a 30-day retention keeps it small.',
  },
  {
    title: 'Transparent scoring, not an LLM',
    why: 'Ranking is a short list of keyword, source and freshness rules. It is explainable, free to run and works without any external API.',
    tradeoff: 'Keywords do not understand context. An off-topic filter and tunable weights compensate, and tuning is a code change you can read.',
  },
  {
    title: 'PR-gated automation',
    why: 'The daily run opens a pull request, the test workflow must pass, and only then does it merge. The export to the site also lands through a pull request.',
    tradeoff: 'Publication follows a chain of workflows rather than a fixed clock time. In return, every data change is reviewable and tested before it merges.',
  },
  {
    title: 'Deterministic de-duplication',
    why: 'A story is its source plus its URL without fragment and tracking parameters. IDs are hashes of source and link, and the export fails if two different URLs ever share an ID.',
    tradeoff: 'The same story under two different URLs is not merged. Predictable beats clever here.',
  },
  {
    title: 'Static export',
    why: 'The site is pre-built and hosted on GitHub Pages. There is no server to patch, scale or pay for.',
    tradeoff: 'New data goes live when the site is redeployed, and the browser reads the JSON files directly.',
  },
  {
    title: 'Accessibility and reduced motion as requirements',
    why: 'Colour tokens are checked against WCAG contrast in both themes. Pages have a skip link, keyboard focus styles and list semantics, and animation is switched off for reduced-motion users.',
    tradeoff: 'A tighter palette and decorative motion kept optional, not load-bearing.',
  },
];

const QUALITY = [
  {
    title: 'Tests in both repos',
    text: 'The pipeline has unit, integration, end-to-end and workflow tests under tests/. The site has component and logic tests with Testing Library.',
  },
  {
    title: 'Contrast as a test',
    text: 'A test reads the real colour tokens and fails if a text pair drops below 4.5:1, in the dark and the light theme.',
  },
  {
    title: 'Fails safe',
    text: 'Feed requests have a hard timeout, files are written atomically, and the optional GitHub trends export keeps the previous file when it fails.',
  },
];

const GATES = [
  {
    repo: 'Pipeline repo',
    items: ['Format check', 'Lint', 'Typecheck', 'Tests with a coverage floor', 'npm audit (production)', 'gitleaks secret scan'],
  },
  {
    repo: 'Site repo',
    items: ['Lint', 'Typecheck', 'Tests with coverage', 'Export data validation'],
  },
];

const STACK = [
  {
    title: 'Pipeline',
    items: ['TypeScript', 'Node.js', 'rss-parser', 'NDJSON', 'proper-lockfile', 'Jest', 'ESLint', 'Prettier'],
  },
  {
    title: 'Site',
    items: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Design tokens', 'Jest', 'Testing Library'],
  },
  {
    title: 'Delivery',
    items: ['GitHub Actions', 'GitHub Pages', 'Custom domain', 'Pull-request merges'],
  },
];

const ROADMAP = [
  {
    status: 'Planned',
    title: 'VPS hosting',
    text: 'A VPS migration is planned for a follow-up phase. Today the pipeline runs on GitHub Actions.',
  },
  {
    status: 'Paused',
    title: 'Knowledge layer',
    text: 'Structured fact extraction from articles exists in the pipeline repo but is switched off by default. It sits outside the article ranking path.',
  },
  {
    status: 'Later',
    title: 'Search and archive',
    text: 'Search and a full archive are out of scope for now. The site keeps the last 30 days.',
  },
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
                <p>
                  An automated news curator for QA and test-automation engineers. A side project, built with the
                  discipline of a production system: tests, CI gates and versioned data.
                </p>
                <FactChips items={FACTS} label="Key facts" />
              </div>
              <div className="cta">
                <Link className="btn" href="/how-it-works">
                  How it works <span aria-hidden="true">→</span>
                </Link>
                <a className="btn ghost" href="#architecture">
                  See the architecture
                </a>
              </div>
            </ContentTile>
          </div>
        </div>
      </div>

      <SectionNav items={NAV_ITEMS} />

      {/* 01 Problem */}
      <section id="problem" className="sec first" aria-labelledby="problem-title">
        <div className="wrap">
          <SectionHead
            no="01"
            eyebrow="Problem"
            title="Signal versus noise"
            titleId="problem-title"
            sub="QA engineers want to stay current without reading everything."
          />
          <div className="cp-grid cp-three">
            {PROBLEMS.map(({ title, text }, i) => (
              <ContentTile key={title} className="cp-card hov" index={i}>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  <span className="tnum">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </ContentTile>
            ))}
          </div>
        </div>
      </section>

      {/* 02 Solution */}
      <section id="solution" className="sec band" aria-labelledby="solution-title">
        <div className="wrap">
          <SectionHead
            no="02"
            eyebrow="Solution"
            title="The solution at a glance"
            titleId="solution-title"
            sub="Collect, rank, publish. Each step is small enough to read in one sitting."
          />
          <div className="cp-grid cp-three">
            {SOLUTION.map(({ title, text }, i) => (
              <ContentTile key={title} className="cp-card hov" index={i}>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  <span className="tnum">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </ContentTile>
            ))}
          </div>
          <p className="cp-note">
            For the mechanics, scoring factors and FAQ, see <Link href="/how-it-works">How it works</Link>.
          </p>
        </div>
      </section>

      {/* 03 Architecture */}
      <section id="architecture" className="sec" aria-labelledby="architecture-title">
        <div className="wrap">
          <SectionHead
            no="03"
            eyebrow="Architecture"
            title="From feed to page"
            titleId="architecture-title"
            sub="Two repositories: a pipeline that produces data and a static site that renders it."
          />
          <ArchitectureDiagram />
        </div>
      </section>

      {/* 04 Engineering decisions */}
      <section id="decisions" className="sec band" aria-labelledby="decisions-title">
        <div className="wrap">
          <SectionHead
            no="04"
            eyebrow="Decisions"
            title="Engineering decisions"
            titleId="decisions-title"
            sub="Each choice has a reason and a cost."
          />
          <div className="cp-grid cp-cards">
            {DECISIONS.map(({ title, why, tradeoff }, i) => (
              <ContentTile key={title} className="cp-card hov" index={i}>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  <span className="tnum">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3>{title}</h3>
                <p>
                  <b className="cp-k">Why</b> {why}
                </p>
                <p>
                  <b className="cp-k">Trade-off</b> {tradeoff}
                </p>
              </ContentTile>
            ))}
          </div>
        </div>
      </section>

      {/* 05 Quality bar */}
      <section id="quality" className="sec" aria-labelledby="quality-title">
        <div className="wrap">
          <SectionHead
            no="05"
            eyebrow="Quality"
            title="The quality bar"
            titleId="quality-title"
            sub="A QA product should be able to show its own checks."
          />
          <div className="cp-grid cp-three">
            {QUALITY.map(({ title, text }, i) => (
              <ContentTile key={title} className="cp-card hov" index={i}>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  <span className="tnum">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </ContentTile>
            ))}
          </div>
          <div className="cp-grid cp-gates">
            {GATES.map(({ repo, items }, i) => (
              <ContentTile key={repo} className="cp-card" index={i}>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  CI gates: {repo}
                </div>
                <ul className="cp-tags" role="list">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ContentTile>
            ))}
          </div>
        </div>
      </section>

      {/* 06 Tech stack */}
      <section id="stack" className="sec band" aria-labelledby="stack-title">
        <div className="wrap">
          <SectionHead no="06" eyebrow="Stack" title="Tech stack" titleId="stack-title" />
          <div className="cp-grid cp-three">
            {STACK.map(({ title, items }, i) => (
              <ContentTile key={title} className="cp-card hov" index={i}>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  {title}
                </div>
                <ul className="cp-tags" role="list">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ContentTile>
            ))}
          </div>
        </div>
      </section>

      {/* 07 What's next */}
      <section id="next" className="sec" aria-labelledby="next-title">
        <div className="wrap">
          <SectionHead
            no="07"
            eyebrow="Roadmap"
            title="What's next"
            titleId="next-title"
            sub="Only what the project documents state. Nothing here is a promise."
          />
          <div className="cp-grid cp-three">
            {ROADMAP.map(({ status, title, text }, i) => (
              <ContentTile key={title} className="cp-card hov" index={i}>
                <div className="tlabel">
                  <span className="dot" aria-hidden="true" />
                  <StatusPill tone={status === 'Planned' ? 'accent' : 'muted'}>{status}</StatusPill>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </ContentTile>
            ))}
          </div>
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
                Feedback, a source to suggest, or a question?{' '}
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
