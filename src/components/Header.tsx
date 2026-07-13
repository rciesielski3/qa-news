'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Daily' },
  { href: '/weekly', label: 'Weekly' },
  { href: '/monthly', label: 'Monthly' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink-600 py-6">
      <Link href="/" className="no-underline">
        <span className="font-mono text-sm tracking-wide text-signal-pass">qa://</span>
        <span className="font-serif text-xl font-semibold text-paper">news</span>
      </Link>

      <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-widest text-paper-muted">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`no-underline hover:text-signal-pass ${
                active ? 'text-signal-pass' : ''
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
