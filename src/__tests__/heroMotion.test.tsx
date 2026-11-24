import fs from 'fs';
import path from 'path';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroBento from '@/components/HeroBento';
import { computeStats } from '@/lib/stats';

const css = fs.readFileSync(path.join(__dirname, '../app/bento.css'), 'utf8');

describe('hero tile motion (CSS)', () => {
  it('has no gridPan animation and no infinite loops in the hero', () => {
    expect(css).not.toMatch(/gridPan/);
    expect(css).not.toMatch(/animation:[^;]*\binfinite\b/);
  });

  it('runs heroDrift, shine and pulse a finite number of times', () => {
    expect(css).toMatch(/animation: heroDrift 22s ease-in-out 3 alternate/);
    expect(css).toMatch(/animation: shine 18s linear 2 /);
    expect(css).toMatch(/animation: pulse 2s 4;/);
  });

  it('keeps hero animations disabled under prefers-reduced-motion', () => {
    expect(css).toMatch(/prefers-reduced-motion: reduce\)[\s\S]*\.t-head::before, \.t-head::after \{ animation: none; \}/);
  });

  it('pauses the hero loops while off-screen', () => {
    expect(css).toMatch(/\.t-head\.paused::before[^{]*\{ animation-play-state: paused; \}/);
  });
});

describe('hero tile off-screen pause', () => {
  type Cb = (entries: Array<Partial<IntersectionObserverEntry>>) => void;
  const callbacks: Cb[] = [];
  const original = global.IntersectionObserver;

  beforeEach(() => {
    callbacks.length = 0;
    global.IntersectionObserver = class {
      constructor(cb: Cb) {
        callbacks.push(cb);
      }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    } as unknown as typeof IntersectionObserver;
  });
  afterEach(() => {
    global.IntersectionObserver = original;
  });

  it('toggles the paused class on the hero tile only', () => {
    const { container } = render(
      <HeroBento stats={computeStats([], '2026-11-23')} isLoading={false} updatedAt={null} onSelectCategory={jest.fn()} />,
    );
    const hero = container.querySelector('.t-head')!;
    expect(hero).not.toHaveClass('paused');
    expect(callbacks.length).toBeGreaterThan(0);
    act(() => callbacks.forEach((cb) => cb([{ isIntersecting: false }])));
    expect(hero).toHaveClass('paused');
    expect(container.querySelector('.t-today')).not.toHaveClass('paused');
    act(() => callbacks.forEach((cb) => cb([{ isIntersecting: true }])));
    expect(hero).not.toHaveClass('paused');
  });
});
