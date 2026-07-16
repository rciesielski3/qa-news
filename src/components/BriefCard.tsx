import type { Category } from '@/lib/types';

export interface BriefCardItem {
  id: string;
  title: string;
  category: Category;
  source: string;
  isTopPick?: boolean;
}

export interface BriefCardProps {
  title: string; // "Daily Brief — Top Picks" | "Weekly Brief — Top Picks" | "Monthly Highlights"
  items: BriefCardItem[];
}

// Category display name mapping
const categoryLabels: Record<Category, string> = {
  'test-automation': 'Test Automation',
  'qa-practice': 'QA Practice',
  'tooling': 'Tooling',
  'engineering': 'Engineering',
  'ai': 'AI',
};

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
              <a href="#">{item.title}</a>
              <span className="brief-meta">
                {categoryLabels[item.category]}
                {item.isTopPick && <span className="toppick">★ Top Pick</span>}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
