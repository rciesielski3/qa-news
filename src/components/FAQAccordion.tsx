'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'Why only 50 articles?',
    answer:
      'Quality over quantity. We filter aggressively for signal, removing noise. You get the best 4.5% of articles instead of information overload. This ensures every article has genuine value to your work.',
  },
  {
    question: 'How are articles selected?',
    answer:
      'Multi-factor AI scoring: relevance to QA engineers, freshness, source quality, and novelty. Articles must rank highly across all factors to make the cut. This ensures balanced, high-quality selection.',
  },
  {
    question: 'When does the pipeline run?',
    answer:
      'The pipeline runs daily: feeds are fetched at 06:00 UTC, articles are scored and selected during the next two hours, and results are published at 08:00 UTC. Check back for fresh picks every morning.',
  },
  {
    question: 'What about articles I miss?',
    answer:
      'The QA News archive maintains all articles published over the past weeks. You can browse Weekly and Monthly views to catch up on stories you may have missed.',
  },
  {
    question: 'Can I request sources?',
    answer:
      'Not yet - this is a planned feature. For now, the 5 feeds are carefully curated for quality and relevance. We focus on maintaining high editorial standards over feed quantity.',
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
