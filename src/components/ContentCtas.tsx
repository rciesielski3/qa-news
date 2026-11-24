import Link from 'next/link';
import ContentTile from '@/components/ContentTile';

const DESTINATIONS = [
  { href: '/', label: 'Daily' },
  { href: '/weekly', label: 'Weekly' },
  { href: '/monthly', label: 'Monthly' },
];

/** Tiles linking back to the three period pages. Whole tile is the click target (stretched link). */
export default function ContentCtas({ startIndex = 0 }: { startIndex?: number }) {
  return (
    <>
      {DESTINATIONS.map(({ href, label }, i) => (
        <ContentTile key={href} className="cp-cta hov" index={startIndex + i}>
          <div className="tlabel">
            <span className="dot" aria-hidden="true" />
            {label}
            <span className="go" aria-hidden="true">
              ↗
            </span>
          </div>
          <Link href={href} className="cp-cta-link">
            {label} <span aria-hidden="true">→</span>
          </Link>
        </ContentTile>
      ))}
    </>
  );
}
