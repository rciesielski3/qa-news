export default function StatusLine({
  sourcesScanned,
  storiesSelected,
  updatedAt,
}: {
  sourcesScanned: number;
  storiesSelected: number;
  updatedAt: string;
}) {
  const time = new Date(updatedAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });

  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded border border-ink-600 bg-ink-800 px-3.5 py-2.5 font-mono text-xs text-paper-muted">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-pass opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-pass" />
      </span>
      <span>{sourcesScanned} sources scanned</span>
      <span aria-hidden className="text-ink-500">
        ·
      </span>
      <span className="text-paper">{storiesSelected} stories selected</span>
      <span aria-hidden className="text-ink-500">
        ·
      </span>
      <span>updated {time} UTC</span>
    </div>
  );
}
