'use client';

import { useState, useEffect } from 'react';
import { getNextRefreshTime } from '@/lib/dateUtils';

export default function RefreshIndicator() {
  const [refreshInfo, setRefreshInfo] = useState<{ minutesUntil: number; timeString: string } | null>(null);

  useEffect(() => {
    setRefreshInfo(getNextRefreshTime());
  }, []);

  if (!refreshInfo) return null;

  return (
    <div className="text-xs text-ink-500 dark:text-paper-muted text-center py-4">
      Next refresh: {refreshInfo.timeString} (at 05:00 UTC)
    </div>
  );
}
