'use client';

import { Suspense } from 'react';
import PeriodPage from '@/components/PeriodPage';
import '../periods.css';

export default function MonthlyPage() {
  return (
    <Suspense fallback={null}>
      <PeriodPage period="month" />
    </Suspense>
  );
}
