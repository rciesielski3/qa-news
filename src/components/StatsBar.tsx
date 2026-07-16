import Link from 'next/link';

// Placeholder pipeline stats. Will read from the live PAIOS Public API once
// it ships (see Footer); for now these mirror the numbers quoted on /about.
export default function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="container">
        <span>5 feeds · 1,110 articles scanned · 50 selected · updated 08:00 UTC</span>
        <Link href="/about" className="stats-link">
          How it works →
        </Link>
      </div>
    </div>
  );
}
