'use client';

import { useScrollSpy } from '@/hooks/useScrollSpy';

export interface SectionNavItem {
  id: string;
  no: string;
  label: string;
  /** Small count pill, e.g. number of picks. */
  count?: number | string;
}

/**
 * No link is marked current until the spy has seen a section: at the top of the
 * page the hero is in view, not section 01, so defaulting to the first link
 * would announce the wrong location.
 */
/** Sticky in-page navigation with scroll-spy: the link of the section in view is marked current. */
export default function SectionNav({ items }: { items: SectionNavItem[] }) {
  const [active, setActive] = useScrollSpy(items.map((item) => item.id));

  return (
    <nav className="secnav" aria-label="Sections">
      <div className="wrap">
        <div className="secnav-in">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-s={item.id}
              className={active === item.id ? 'on' : undefined}
              aria-current={active === item.id ? 'location' : undefined}
              onClick={() => setActive(item.id)}
            >
              <b>{item.no}</b>
              {item.label}
              {item.count !== undefined && <i>{item.count}</i>}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
