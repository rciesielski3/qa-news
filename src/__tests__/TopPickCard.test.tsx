import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TopPickCard from '@/components/TopPickCard';
import type { Article } from '@/lib/types';

const mockArticle: Article = {
  id: '1',
  title: 'Test Article',
  subtitle: 'Test subtitle',
  summary: 'Test summary',
  url: 'https://example.com',
  source: 'Example',
  category: 'test-automation',
  publishedAt: '2026-07-16T00:00:00Z',
  tags: ['testing'],
};

describe('TopPickCard', () => {
  it('renders rank badge', () => {
    render(<TopPickCard article={mockArticle} rank={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders title and subtitle', () => {
    render(<TopPickCard article={mockArticle} rank={1} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('renders "Top Pick" badge', () => {
    render(<TopPickCard article={mockArticle} rank={1} />);
    expect(screen.getByText('Top Pick')).toBeInTheDocument();
  });

  it('renders read article link', () => {
    render(<TopPickCard article={mockArticle} rank={1} />);
    const link = screen.getByText('Read Article →');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
