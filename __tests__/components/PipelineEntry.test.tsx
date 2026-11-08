import { render, screen } from '@testing-library/react';
import PipelineEntry from '@/components/PipelineEntry';
import type { Article } from '@/lib/types';

describe('PipelineEntry', () => {
  const baseArticle: Article = {
    id: 'test-1',
    title: 'Test Title',
    url: 'https://example.com',
    category: 'test-automation' as const,
    source: 'Test Source',
    publishedAt: '2026-07-17T00:00:00Z',
  };

  const summary = 'Summary text that is long enough.';

  it('derives the subtitle from the description, not the summary, and shows the text once', () => {
    render(<PipelineEntry article={{ ...baseArticle, summary, description: 'Another description.' }} />);
    expect(screen.queryByText(summary)).not.toBeInTheDocument();
    expect(screen.getByText('Another description.')).toBeInTheDocument();
    expect(screen.queryAllByText('Another description.')).toHaveLength(1);
  });

  it('hides the subtitle when the description contains it (case-insensitive)', () => {
    render(
      <PipelineEntry
        article={{
          ...baseArticle,
          summary,
          description: `  Intro line. ${summary.toUpperCase()} More detail.  `,
        }}
      />,
    );
    // Subtitle and description both start with the same text; only one may render.
    expect(screen.queryAllByText(/Intro line/i)).toHaveLength(1);
    expect(screen.getByText(/More detail\.$/)).toBeInTheDocument();
  });

  it('shows the description when there is no subtitle', () => {
    render(<PipelineEntry article={{ ...baseArticle, description: 'Only a description here.' }} />);
    expect(screen.getByText('Only a description here.')).toBeInTheDocument();
  });
});
