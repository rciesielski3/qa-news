import type { Category } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/styles';

export interface BriefCardItem {
  id: string;
  title: string;
  category: Category;
  url: string;
  isTopPick?: boolean;
}

export interface BriefCardProps {
  title: string; // "Daily Brief — Top Picks" | "Weekly Brief — Top Picks" | "Monthly Highlights"
  items: BriefCardItem[];
}

export default function BriefCard({ title, items }: BriefCardProps) {
  return (
    <section className="brief-card" aria-labelledby="brief-h">
      <h2 id="brief-h" className="brief-title">
        {title}
      </h2>

      <ul className={`brief-list ${items.length >= 4 ? 'brief-list--grid' : ''}`}>
        {items.map((item) => (
          <li
            className="brief-item"
            key={item.id}
            data-cat={item.category}
          >
            <div>
              <a href={item.url}>{item.title}</a>
              <span className="brief-meta">
                {CATEGORY_LABELS[item.category]}
                {item.isTopPick && <span className="toppick">★ Top Pick</span>}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
