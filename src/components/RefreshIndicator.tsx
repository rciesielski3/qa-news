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
    <div className="refresh-indicator text-xs text-center">
      Next refresh: {refreshInfo.timeString} (at 05:00 UTC)
    </div>
  );
}
