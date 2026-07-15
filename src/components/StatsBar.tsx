'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function StatsBar() {
  const [lastUpdate, setLastUpdate] = useState('06:00 UTC');
  const [showSampleData, setShowSampleData] = useState(false);

  useEffect(() => {
    // Calculate current time in HH:MM UTC format
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    setLastUpdate(`${hours}:${minutes} UTC`);

    // Set sample data indicator (can be determined by env or config)
    setShowSampleData(false);
  }, []);

  return (
    <div className="static md:sticky md:top-0 md:z-50 bg-ink-800 px-5 py-2 sm:px-8 sm:py-3 shadow-sm">
      <div className="mx-auto flex max-w-content flex-col gap-2 items-start sm:items-center sm:justify-between sm:gap-4">
        <div className="font-mono text-xs sm:text-sm text-paper-muted">
          5 feeds · 1,110 articles · 50 selected
          {showSampleData && <span className="ml-2">(sample data)</span>}
          · Last update: {lastUpdate}
        </div>
        <Link
          href="/about"
          className="text-xs sm:text-sm font-medium text-signal-info hover:text-signal-pass transition"
        >
          How it works →
        </Link>
      </div>
    </div>
  );
}
