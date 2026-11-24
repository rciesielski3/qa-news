'use client';

import { usePathname } from 'next/navigation';

/**
 * The Daily page owns its full-bleed layout (hero, banded sections); every
 * other route keeps the narrow shared container.
 */
export default function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/') return <>{children}</>;
  return <div className="container">{children}</div>;
}
