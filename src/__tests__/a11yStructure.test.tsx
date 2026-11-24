import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkipLink from '@/components/SkipLink';
import FilterBar from '@/components/FilterBar';
import ArticleList from '@/components/ArticleList';
import { TrendingReposView } from '@/components/TrendingRepos';
import type { Article } from '@/lib/types';

const css = fs.readFileSync(path.join(__dirname, '../app/bento.css'), 'utf8');
const layout = fs.readFileSync(path.join(__dirname, '../app/layout.tsx'), 'utf8');

const article: Article = {
  id: 'x1',
  title: 'T',
  url: 'https://e.com/1',
  source: 'S',
  category: 'ai',
  publishedAt: '2026-11-23T08:00:00Z',
};

describe('skip link', () => {
  it('links to the main landmark and is focusable', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: 'Skip to content' });
    expect(link).toHaveAttribute('href', '#top');
    link.focus();
    expect(link).toHaveFocus();
  });

  it('is the first element in the layout and targets a focusable <main id="top">', () => {
    expect(layout.indexOf('<SkipLink />')).toBeGreaterThan(-1);
    expect(layout.indexOf('<SkipLink />')).toBeLessThan(layout.indexOf('<Header />'));
    expect(layout).toMatch(/<main id="top" tabIndex=\{-1\}>/);
  });

  it('is hidden until focused', () => {
    expect(css).toMatch(/\.skip-link \{[^}]*translateY\(-120%\)/);
    expect(css).toMatch(/\.skip-link:focus[^{]*\{ transform: none;/);
  });
});

describe('filter status live region', () => {
  const props = {
    categories: [{ id: 'ai' as const, label: 'AI' }],
    availableTags: [],
    onCategoryChange: jest.fn(),
    onTagChange: jest.fn(),
    onReset: jest.fn(),
    totalArticles: 10,
    shownArticles: 4,
  };

  it('is always mounted as a polite status, empty without filters', () => {
    render(<FilterBar {...props} activeFilters={{}} />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toBeEmptyDOMElement();
  });

  it('keeps the same node and fills it when a filter becomes active', () => {
    const { rerender } = render(<FilterBar {...props} activeFilters={{}} />);
    const before = screen.getByRole('status');
    rerender(<FilterBar {...props} activeFilters={{ category: 'ai' }} />);
    const after = screen.getByRole('status');
    expect(after).toBe(before);
    expect(after).toHaveTextContent('Showing 4 of 10 articles');
    fireEvent.click(screen.getByText('Reset filters'));
    expect(props.onReset).toHaveBeenCalled();
  });
});

describe('list semantics and focus geometry', () => {
  it('gives the feed list and repo list an explicit list role', () => {
    const { container } = render(<ArticleList articles={[article]} />);
    expect(container.querySelector('.feed-list')).toHaveAttribute('role', 'list');
    const repos = render(
      <TrendingReposView repos={[{ title: 'o/r', url: 'https://github.com/o/r', category: 'tooling' } as never]} />,
    );
    expect(repos.container.querySelector('.repos')).toHaveAttribute('role', 'list');
  });

  it('leaves room for focus rings and anchor offsets', () => {
    expect(css).toMatch(/\.secnav-in \{[^}]*padding-inline: 6px/);
    const margin = css.match(/\.sec \{[^}]*scroll-margin-top: (\d+)px/);
    expect(Number(margin?.[1])).toBeGreaterThanOrEqual(128);
  });

  it('gives the pick-link focus ring the card radius, not inherit', () => {
    const tile = css.match(/\.tile \{[^}]*border-radius: (\d+px)/);
    const link = css.match(/\.pick-link::after \{[^}]*border-radius: (\d+px)/);
    expect(link?.[1]).toBeDefined();
    expect(link?.[1]).toBe(tile?.[1]);
  });
});
