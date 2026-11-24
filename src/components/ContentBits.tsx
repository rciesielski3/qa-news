/** Small server-safe building blocks shared by the About and How it works pages. */

/** Row of short fact chips (mono pills) used under a page hero. */
export function FactChips({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className="cp-chips" role="list" aria-label={label}>
      {items.map((item) => (
        <li key={item} className="cp-chip">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Status marker for roadmap items, e.g. "Planned". Always text, never colour alone. */
export function StatusPill({ children, tone = 'accent' }: { children: string; tone?: 'accent' | 'muted' }) {
  return <span className={`cp-pill ${tone}`}>{children}</span>;
}
