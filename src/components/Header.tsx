'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ThemeToggle from '@/components/ThemeToggle';

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
    <header className="site-header">
      <div className="container">
        <span className="site-title">QA News</span>
        <nav className="nav" aria-label="Primary">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className="nav-link"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
