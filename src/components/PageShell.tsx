'use client';

import { usePathname } from 'next/navigation';

/** Routes that own their full-bleed layout (hero, banded sections), one per line. */
const FULL_BLEED_ROUTES = new Set([
  '/',
  '/weekly',
  '/monthly',
]);

/** Every other route keeps the narrow shared container. */
export default function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // trailingSlash is on, so '/weekly/' must match '/weekly'
  const route = pathname && pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (route && FULL_BLEED_ROUTES.has(route)) return <>{children}</>;
  return <div className="container">{children}</div>;
}
