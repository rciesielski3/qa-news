'use client';

import { useId, useState } from 'react';

const faqs = [
  {
    question: 'How many articles do I see?',
    answer:
      'Each period page highlights the three highest-scoring articles as Top Picks (at most one per source) and lists the rest, filterable by category and tag. The site holds the last 30 days.',
  },
  {
    question: 'When does new data appear?',
    answer:
      'The daily run starts at 08:00 UTC; the change then goes through a pull request, tests and an export workflow. Publication follows those steps, not a fixed clock time.',
  },
  {
    question: 'What about articles I miss?',
    answer: 'Use Weekly and Monthly: they cover the last 7 and 30 days. Articles older than 30 days are pruned.',
  },
  {
    question: 'Can I request sources?',
    answer:
      'Sources are a curated list in the pipeline configuration. Suggestions are welcome through the feedback link on the About page.',
  },
];

/**
 * Expand/collapse accordion for the FAQ section. Only one answer is open
 * at a time. Lives in its own 'use client' file (rather than inline in
 * page.tsx) because page.tsx is a Server Component that exports
 * `metadata` — a file can't be both 'use client' and export metadata.
 *
 * Each question is a real button (Enter/Space toggle, focus-visible ring)
 * with aria-expanded and aria-controls pointing at its answer region.
 */
export default function FAQAccordion() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="faq">
      {faqs.map((faq, idx) => {
        const isOpen = expanded === idx;
        const panelId = `${baseId}-panel-${idx}`;
        const buttonId = `${baseId}-btn-${idx}`;
        return (
          <div key={faq.question} className={`tile faq-item${isOpen ? ' open' : ''}`}>
            <h3 className="faq-q">
              <button
                type="button"
                id={buttonId}
                onClick={() => setExpanded(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
              >
                <b className="tnum" aria-hidden="true">
                  {String(idx + 1).padStart(2, '0')}
                </b>
                <span className="faq-text">{faq.question}</span>
                <span className="faq-icon" aria-hidden="true" />
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="faq-a">
                <p className="prose">{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
