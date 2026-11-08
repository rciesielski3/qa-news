'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatTimeInBothZones, getNextRefreshTimeWithZones } from '@/lib/dateUtils';

export default function StatsBar() {
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [nextRefresh, setNextRefresh] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/latest.json');
        const data = (await response.json()) as { updatedAt?: string };
        if (data.updatedAt) {
          setUpdatedAt(data.updatedAt);
        }

        const refreshInfo = getNextRefreshTimeWithZones();
        setNextRefresh(`Next refresh: ${refreshInfo.timeString} (${refreshInfo.displayString})`);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const updatedDisplay = updatedAt ? formatTimeInBothZones(updatedAt) : 'loading...';

  return (
    <div className="stats-bar">
      <div className="container">
        <span>5 feeds · 1,110 articles scanned · 50 selected · updated {updatedDisplay} GMT+2</span>
        <Link href="/how-it-works" className="stats-link">
          How it works →
        </Link>
      </div>
      {nextRefresh && (
        <div className="container" style={{ marginTop: '0.5rem', fontSize: '0.9em', opacity: 0.8 }}>
          <span>Next refresh: {nextRefresh}</span>
        </div>
      )}
    </div>
  );
}
