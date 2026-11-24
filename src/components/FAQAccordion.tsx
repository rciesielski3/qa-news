'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'How many articles do I see?',
    answer:
      'Each period page (Today, Weekly, Monthly) highlights the three highest-scoring articles as Top Picks and lists the rest of that period below, filterable by category and tag. The site holds the last 30 days.',
  },
  {
    question: 'How are articles selected?',
    answer:
      'With fixed, rule-based scoring, not a language model: a base score plus weights for QA and testing keywords, a source weight and a small bonus for articles under 24 hours old. Hardware and networking items are filtered out unless they also cover testing.',
  },
  {
    question: 'When does the pipeline run?',
    answer:
      'The daily-brief workflow starts at 08:00 UTC. Its data change goes through a pull request, and after tests pass and it is merged, an export workflow publishes the new data to the site. Publication follows those steps, not a fixed clock time.',
  },
  {
    question: 'What about articles I miss?',
    answer:
      'Use the Weekly and Monthly views. They cover the last 7 and 30 days of the same data. Articles older than 30 days are pruned.',
  },
  {
    question: 'Can I request sources?',
    answer:
      'Sources are a curated list in the pipeline configuration, so there is no self-service option. Suggestions are welcome through the feedback link on the About page.',
  },
];

/**
 * Expand/collapse accordion for the FAQ section. Only one answer is open
 * at a time. Lives in its own 'use client' file (rather than inline in
 * page.tsx) because page.tsx is a Server Component that exports
 * `metadata` — a file can't be both 'use client' and export metadata.
 */
export default function FAQAccordion() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {faqs.map((faq, idx) => {
        const isOpen = expanded === idx;
        return (
          <div key={faq.question} className="border border-ink-200 dark:border-ink-600 rounded bg-ink-50 dark:bg-ink-900">
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="w-full px-4 py-3 text-left font-semibold text-base bg-ink-100 dark:bg-ink-800 hover:brightness-95 dark:hover:brightness-110 transition-colors flex items-center justify-between"
            >
              {faq.question}
              <span className="text-sm ml-2" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <div className="px-4 py-3 bg-ink-50 dark:bg-ink-800 border-t border-ink-200 dark:border-ink-600">
                <p className="prose">{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
