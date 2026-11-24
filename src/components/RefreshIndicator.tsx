'use client';

import { useState, useEffect } from 'react';
import { formatRefreshHourUTC, getNextRefreshTime } from '@/lib/dateUtils';

export default function RefreshIndicator() {
  const [refreshInfo, setRefreshInfo] = useState<{ minutesUntil: number; timeString: string } | null>(null);

  useEffect(() => {
    setRefreshInfo(getNextRefreshTime());
  }, []);

  if (!refreshInfo) return null;

  return (
    <div className="refresh-indicator text-xs text-center">
      Next refresh: {refreshInfo.timeString} (daily ~{formatRefreshHourUTC()})
    </div>
  );
}
