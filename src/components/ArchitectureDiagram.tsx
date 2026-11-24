import ContentTile from '@/components/ContentTile';

const NODES = [
  { kind: 'Input', title: 'Feeds', detail: 'Curated RSS and Atom feeds', where: 'External' },
  {
    kind: 'Compute',
    title: 'Pipeline',
    detail: 'Fetch, normalise, de-duplicate and score. TypeScript on GitHub Actions',
    where: 'Pipeline repo',
  },
  { kind: 'Store', title: 'NDJSON in Git', detail: 'Articles from the last 30 days, versioned with the code', where: 'Pipeline repo' },
  {
    kind: 'Export',
    title: 'JSON exports',
    detail: 'latest.json with 30 days of articles, trending.json from GitHub search',
    where: 'Export workflow',
  },
  { kind: 'Serve', title: 'Static site', detail: 'Next.js static export on GitHub Pages, reading the JSON in the browser', where: 'Site repo' },
];

const PATH = ['Daily run, 08:00 UTC', 'Pull request', 'Tests pass', 'Merge', 'Export pull request', 'Site deploy'];

/**
 * System architecture as plain HTML: the diagram is an ordered list of stages, so the
 * markup itself is the text alternative. Arrows are CSS shapes (no text). Five columns on
 * wide screens, one vertical stack on narrow ones, so nothing needs sideways scrolling.
 */
export default function ArchitectureDiagram() {
  return (
    <figure className="cp-arch" aria-labelledby="arch-caption">
      <ol className="cp-arch-flow" role="list">
        {NODES.map(({ kind, title, detail, where }, i) => (
          <li key={title}>
            <ContentTile className="cp-node" index={i}>
              <div className="tlabel">
                <span className="dot" aria-hidden="true" />
                {kind}
              </div>
              <h3>{title}</h3>
              <p>{detail}</p>
              <span className="cp-where">{where}</span>
            </ContentTile>
          </li>
        ))}
      </ol>
      <ContentTile className="cp-path-tile" index={5}>
        <div className="tlabel">
          <span className="dot" aria-hidden="true" />
          Delivery path
        </div>
        <ol className="cp-path" role="list">
          {PATH.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </ContentTile>
      <figcaption id="arch-caption" className="cp-caption">
        Feeds go through the pipeline into a Git-versioned store, are exported as JSON and served by a static site.
      </figcaption>
    </figure>
  );
}
