import { render, screen } from '@testing-library/react';
import TopPickCard from '@/components/TopPickCard';
import type { Article } from '@/lib/types';

describe('TopPickCard', () => {
  const testArticle: Article = {
    id: 'test-1',
    title: 'Test Title',
    url: 'https://example.com',
    category: 'test-automation' as const,
    source: 'Test Source',
    publishedAt: '2026-07-17T00:00:00Z',
  };

  it('renders with three-zone flex layout', () => {
    render(<TopPickCard article={testArticle} rank={1} />);

    // Get the main container via the title heading
    const heading = screen.getByRole('heading', { name: /Test Title/ });
    const container = heading.closest('div');

    // Navigate up to find the outer container
    let outerContainer = container?.parentElement;
    while (outerContainer && !outerContainer.classList.contains('flex')) {
      outerContainer = outerContainer.parentElement;
    }

    // Verify outer container has flex-col justify-between
    expect(outerContainer).toHaveClass('flex', 'flex-col', 'justify-between');

    // Verify header has flex-shrink-0
    const headerDiv = outerContainer?.querySelector('.flex-shrink-0');
    expect(headerDiv).toBeInTheDocument();

    // Verify footer (Read Article button) has flex-shrink-0
    const footerBtn = outerContainer?.querySelector('a[href="https://example.com"]');
    expect(footerBtn).toHaveClass('flex-shrink-0');
  });

  it('renders article title', () => {
    render(<TopPickCard article={testArticle} rank={1} />);
    expect(screen.getByRole('heading', { name: /Test Title/ })).toBeInTheDocument();
  });

  it('renders rank badge', () => {
    render(<TopPickCard article={testArticle} rank={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders Top Pick badge', () => {
    render(<TopPickCard article={testArticle} rank={1} />);
    expect(screen.getByText('Top Pick')).toBeInTheDocument();
  });

  it('renders Read Article button', () => {
    render(<TopPickCard article={testArticle} rank={1} />);
    const link = screen.getByRole('link', { name: /Read Article/ });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders subtitle when provided', () => {
    const articleWithSubtitle: Article = {
      ...testArticle,
      subtitle: 'Test Subtitle',
    };
    render(<TopPickCard article={articleWithSubtitle} rank={1} />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders summary when subtitle not provided but summary is', () => {
    const articleWithSummary: Article = {
      ...testArticle,
      summary: 'Test Summary',
    };
    render(<TopPickCard article={articleWithSummary} rank={1} />);
    expect(screen.getByText('Test Summary')).toBeInTheDocument();
  });

  it('does not render summary when subtitle is provided', () => {
    const articleWithBoth: Article = {
      ...testArticle,
      subtitle: 'Test Subtitle',
      summary: 'Test Summary',
    };
    render(<TopPickCard article={articleWithBoth} rank={1} />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.queryByText('Test Summary')).not.toBeInTheDocument();
  });
});
