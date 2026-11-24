import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <p>
        QA News aggregates QA & testing articles from multiple RSS feeds into a read-only daily brief - articles are fetched, never edited or removed by this app.
      </p>
      <div className="footer-row">
        <span>© {currentYear} Adateo Rafał Ciesielski</span>
        <span className="footer-links">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/about">About</Link>
          <a href="#top">Back to top ↑</a>
        </span>
      </div>
    </>
  );
}
