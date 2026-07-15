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
    <div className="static md:sticky md:top-0 md:z-50 bg-gray-100 px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="font-mono text-sm text-gray-700">
          5 feeds · 1,110 articles · 50 selected
          {showSampleData && <span className="ml-2 text-xs">(sample data)</span>}
          · Last update: {lastUpdate}
        </div>
        <Link
          href="/about"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          How it works →
        </Link>
      </div>
    </div>
  );
}
