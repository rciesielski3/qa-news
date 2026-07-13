import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-600 py-8 font-mono text-xs text-paper-faint">
      <p>
        QA News is a read-only view over the{' '}
        <span className="text-paper-muted">PAIOS Knowledge Layer</span>. It selects nothing and
        writes nothing — every story here was curated upstream.
      </p>
      <p className="mt-2">A new Daily Brief lands every morning at 06:00 UTC. Worth a bookmark.</p>
      <p className="mt-2">
        This build runs on sample data while the PAIOS Public API is in progress — story links
        are placeholders, not live sources.
      </p>
      <p className="mt-4 border-t border-ink-600 pt-4">
        Public API &amp; RSS feed — coming in a later stage. Built by{' '}
        <Link href="/about" className="text-paper-muted hover:text-signal-pass">
          the developer
        </Link>
        .
      </p>
    </footer>
  );
}
