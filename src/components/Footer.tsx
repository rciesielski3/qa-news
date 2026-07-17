export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <p>
        QA News is a read-only view over the PAIOS Knowledge Layer.
      </p>
      <p>New Daily Brief every morning at 08:00 UTC.</p>
      <p className="text-xs text-ink-600 dark:text-ink-400 pt-4 border-t border-ink-200 dark:border-ink-700 mt-4">
        © {currentYear} Adateo Rafał Ciesielski
      </p>
    </>
  );
}
