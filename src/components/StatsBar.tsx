'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatTimeInBothZones, getNextRefreshTimeWithZones } from '@/lib/dateUtils';
import { computeStats } from '@/lib/stats';
import type { Article } from '@/lib/types';

/**
 * Slim status line for the inner pages. The Daily page shows the same facts in
 * its hero, so the bar hides itself there. Every number comes from latest.json.
 */
export default function StatsBar() {
  const pathname = usePathname();
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [counts, setCounts] = useState<{ sources: number; total: number } | null>(null);
  const [nextRefresh, setNextRefresh] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        const response = await fetch('/latest.json');
        const data = (await response.json()) as { updatedAt?: string; articles?: Article[] };
        if (cancelled) return;
        if (data.updatedAt) setUpdatedAt(data.updatedAt);
        const stats = computeStats(data.articles ?? []);
        setCounts({ sources: stats.sourceCount, total: stats.total });

        const refreshInfo = getNextRefreshTimeWithZones();
        setNextRefresh(`${refreshInfo.timeString} (${refreshInfo.displayString})`);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  if (pathname === '/') return null;

  const updatedDisplay = updatedAt ? `${formatTimeInBothZones(updatedAt)} GMT+2` : 'loading...';
  const summary = counts ? `${counts.sources} sources · ${counts.total} articles · ` : '';

  return (
    <div className="stats-bar">
      <div className="wrap">
        <span>
          {summary}updated {updatedDisplay}
          {nextRefresh && ` · next refresh ${nextRefresh}`}
        </span>
        <Link href="/how-it-works" className="stats-link">
          How it works →
        </Link>
      </div>
    </div>
  );
}
