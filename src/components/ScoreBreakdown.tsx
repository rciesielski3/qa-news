import ContentTile from '@/components/ContentTile';

/** Bar width is the row's maximum contribution relative to the strongest keyword (50 points). */
const ROWS = [
  { name: 'Base', max: 50, value: '50', note: 'Every article starts here.' },
  { name: 'Core QA keywords', max: 50, value: 'up to +50 each', note: 'test automation, qa engineering, testing strategy' },
  { name: 'Method keywords', max: 35, value: 'up to +35 each', note: 'e2e testing, automated testing, performance testing, testing' },
  { name: 'Context keywords', max: 20, value: 'up to +20 each', note: 'qa, playwright, typescript, ci/cd' },
  { name: 'Source prior', max: 10, value: 'up to +10', note: 'A small prior for a few primary QA and testing sources. Never decisive.' },
  { name: 'Freshness', max: 4, value: 'up to +4', note: 'Only for articles under 24 hours old.' },
];

/**
 * Score anatomy as a labelled bar list. Bars are decorative (aria-hidden): every row states
 * its contribution as text, so the breakdown reads the same without the visual.
 */
export default function ScoreBreakdown() {
  return (
    <ContentTile className="cp-score" index={0}>
      <div className="tlabel">
        <span className="dot" aria-hidden="true" />
        Score anatomy
      </div>
      <ul className="cp-score-rows" role="list">
        {ROWS.map(({ name, max, value, note }, i) => (
          <li key={name} className="cp-score-row">
            <span className="nm">{name}</span>
            <span className="track" aria-hidden="true">
              <span className="fill" style={{ width: `${Math.max((max / 50) * 100, 3)}%`, animationDelay: `${i * 90}ms` }} />
            </span>
            <span className="val tnum">{value}</span>
            <span className="nt">{note}</span>
          </li>
        ))}
      </ul>
      <p className="cp-score-foot">
        Score = base + every keyword found in the title or summary + source prior + freshness. Keywords decide: the
        source prior and freshness are deliberately small. These are the current defaults of the scoring config.
      </p>
    </ContentTile>
  );
}
