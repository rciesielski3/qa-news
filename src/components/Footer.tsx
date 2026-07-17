export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <p className="text-xs text-ink-600 dark:text-ink-400 text-center">
        QA News aggregates QA & testing articles from multiple RSS feeds into a read-only daily brief - articles are fetched, never edited or removed by this app.
      </p>
      <p className="text-xs text-ink-600 dark:text-ink-400 text-center mt-2">
        New Daily Brief every morning at 08:00 UTC.
      </p>
      <p className="text-xs text-ink-600 dark:text-ink-400 pt-3 border-t border-ink-200 dark:border-ink-700 mt-3 text-center">
        © {currentYear} Adateo Rafał Ciesielski
      </p>
    </>
  );
}
