/** First focusable element: lets keyboard and screen-reader users jump past the header to <main id="top">. */
export default function SkipLink() {
  return (
    <a className="skip-link" href="#top">
      Skip to content
    </a>
  );
}
