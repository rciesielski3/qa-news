export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <p className="text-xs text-ink-600 dark:text-ink-400">
        QA News: daily briefing of curated QA & testing articles - updated daily at 08:00 UTC
      </p>
      <p className="text-xs text-ink-600 dark:text-ink-400 pt-3 border-t border-ink-200 dark:border-ink-700 mt-3 text-center">
        © {currentYear} Adateo Rafał Ciesielski
      </p>
    </>
  );
}
