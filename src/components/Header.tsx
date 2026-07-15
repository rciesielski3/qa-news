'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Daily' },
  { href: '/weekly', label: 'Weekly' },
  { href: '/monthly', label: 'Monthly' },
  { href: '/about', label: 'About' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-ink-600 bg-ink-900">
      <div className="mx-auto max-w-content px-5 py-4 sm:px-8 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-lg font-bold text-paper sm:text-xl">QA News</h1>
          <nav className="flex flex-wrap gap-2 justify-end">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded border-2 px-3 py-1.5 text-sm font-medium transition sm:px-4 sm:py-2 ${
                    active
                      ? 'border-signal-info bg-signal-info/10 text-signal-info'
                      : 'border-ink-600 text-paper-muted hover:border-ink-500 hover:text-paper'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
