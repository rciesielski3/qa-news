import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PipelineEntry from '@/components/PipelineEntry';
import type { Article } from '@/lib/types';

const mockArticle: Article = {
  id: '1',
  title: 'Test Article',
  url: 'https://example.com',
  source: 'Example',
  category: 'test-automation',
  publishedAt: '2026-08-04T13:00:00Z',
  tags: ['testing'],
};

describe('PipelineEntry', () => {
  it('renders title', () => {
    render(<PipelineEntry article={mockArticle} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });

  it('renders source and category metadata', () => {
    render(<PipelineEntry article={mockArticle} />);
    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByText('Test Automation')).toBeInTheDocument();
  });

  it('renders read button', () => {
    render(<PipelineEntry article={mockArticle} />);
    expect(screen.getByText('Read')).toBeInTheDocument();
  });

  it('prioritizes subtitle over summary', () => {
    const article: Article = {
      ...mockArticle,
      subtitle: 'Test subtitle',
      summary: 'Test summary',
    };
    render(<PipelineEntry article={article} />);
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    expect(screen.queryByText('Test summary')).not.toBeInTheDocument();
  });

  it('falls back to summary when subtitle is missing', () => {
    const article: Article = {
      ...mockArticle,
      summary: 'Test summary',
    };
    render(<PipelineEntry article={article} />);
    expect(screen.getByText('Test summary')).toBeInTheDocument();
  });

  it('falls back to description when subtitle and summary are missing', () => {
    const article: Article = {
      ...mockArticle,
      description: 'Test description',
    };
    render(<PipelineEntry article={article} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders nothing when all text fields are empty', () => {
    render(<PipelineEntry article={mockArticle} />);
    expect(screen.queryByText('Test subtitle')).not.toBeInTheDocument();
    expect(screen.queryByText('Test summary')).not.toBeInTheDocument();
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('applies correct line-clamp classes', () => {
    const articleWithSubtitle: Article = {
      ...mockArticle,
      subtitle: 'Test subtitle',
    };
    const { container } = render(<PipelineEntry article={articleWithSubtitle} />);
    const subtitleElement = screen.getByText('Test subtitle') as HTMLElement;
    expect(subtitleElement.className).toMatch(/line-clamp-1/);
  });

  it('applies line-clamp-2 for summary', () => {
    const articleWithSummary: Article = {
      ...mockArticle,
      summary: 'Test summary with longer text that might wrap',
    };
    render(<PipelineEntry article={articleWithSummary} />);
    const summaryElement = screen.getByText(/Test summary/) as HTMLElement;
    expect(summaryElement.className).toMatch(/line-clamp-2/);
  });
});
