'use client';

import { Suspense } from 'react';
import PeriodPage from '@/components/PeriodPage';
import '../periods.css';

export default function WeeklyPage() {
  return (
    <Suspense fallback={null}>
      <PeriodPage period="week" />
    </Suspense>
  );
}
