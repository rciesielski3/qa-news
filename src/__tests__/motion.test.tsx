import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useReveal, motionAllowed, staggerDelay } from '@/hooks/useReveal';
import { useCountUp } from '@/hooks/useCountUp';

function Probe({ to }: { to: number }) {
  const { ref, className } = useReveal<HTMLDivElement>(0);
  const value = useCountUp(to, 100);
  return (
    <div ref={ref} data-testid="probe" className={className}>
      {value}
    </div>
  );
}

const origMM = window.matchMedia;
const origIO = global.IntersectionObserver;

function mockMatchMedia(reduce: boolean) {
  window.matchMedia = ((q: string) => ({ matches: reduce && q.includes('reduce'), media: q })) as unknown as typeof window.matchMedia;
}

const origRect = HTMLElement.prototype.getBoundingClientRect;
const origRects = HTMLElement.prototype.getClientRects;

/** jsdom has no layout: fake an element box at `top` px (viewport height is 768). */
function mockBox(top: number, height = 100) {
  HTMLElement.prototype.getBoundingClientRect = () =>
    ({ top, bottom: top + height, left: 0, right: 200, width: height ? 200 : 0, height, x: 0, y: top }) as DOMRect;
  HTMLElement.prototype.getClientRects = () => (height ? [{}] : []) as unknown as DOMRectList;
}

function mockIO(onCreate?: (cb: (e: Array<{ isIntersecting: boolean }>) => void) => void) {
  global.IntersectionObserver = class {
    constructor(c: (e: Array<{ isIntersecting: boolean }>) => void) {
      onCreate?.(c);
    }
    observe() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
}

afterEach(() => {
  HTMLElement.prototype.getBoundingClientRect = origRect;
  HTMLElement.prototype.getClientRects = origRects;
  window.matchMedia = origMM;
  global.IntersectionObserver = origIO;
  jest.useRealTimers();
});

describe('motion hooks', () => {
  it('motionAllowed is false without matchMedia and under reduced motion, true otherwise', () => {
    expect(motionAllowed()).toBe(false);
    mockMatchMedia(true);
    expect(motionAllowed()).toBe(false);
    mockMatchMedia(false);
    expect(motionAllowed()).toBe(true);
  });

  it('staggerDelay is 70ms per sibling, capped', () => {
    expect(staggerDelay(0)).toBe(0);
    expect(staggerDelay(2)).toBe(140);
    expect(staggerDelay(50)).toBe(560);
  });

  it('leaves content visible and shows the final number when motion is not allowed', () => {
    render(<Probe to={42} />);
    expect(screen.getByTestId('probe')).toHaveTextContent('42');
    expect(screen.getByTestId('probe').className).toBe('');
  });

  it('arms the reveal, reveals on intersection, then settles', () => {
    jest.useFakeTimers();
    mockMatchMedia(false);
    let cb: ((e: Array<{ isIntersecting: boolean }>) => void) | null = null;
    global.IntersectionObserver = class {
      constructor(c: typeof cb) {
        cb = c;
      }
      observe() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
    mockBox(2000);
    window.requestAnimationFrame = ((f: FrameRequestCallback) => setTimeout(() => f(performance.now()), 16)) as unknown as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = ((id: number) => clearTimeout(id)) as unknown as typeof window.cancelAnimationFrame;

    render(<Probe to={10} />);
    const el = screen.getByTestId('probe');
    expect(el).toHaveClass('reveal');
    expect(el).not.toHaveClass('in');

    act(() => cb?.([{ isIntersecting: false }]));
    expect(el).not.toHaveClass('in');
    act(() => cb?.([{ isIntersecting: true }]));
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(el).toHaveClass('in');
    act(() => {
      jest.advanceTimersByTime(1200);
    });
    expect(el.className).toBe('');
    expect(el).toHaveTextContent('10'); // counter finished
  });

  it('does not hide elements that start inside the first viewport', () => {
    mockMatchMedia(false);
    mockBox(200);
    mockIO();
    render(<Probe to={5} />);
    expect(screen.getByTestId('probe').className).toBe('');
  });

  it('does not hide elements without a box (display:none ancestor, zero height)', () => {
    mockMatchMedia(false);
    mockBox(2000, 0);
    mockIO();
    render(<Probe to={5} />);
    expect(screen.getByTestId('probe').className).toBe('');
  });

  it('reveals an armed element that never gets a box instead of keeping it hidden forever', () => {
    jest.useFakeTimers();
    mockMatchMedia(false);
    mockBox(2000);
    mockIO();
    render(<Probe to={5} />);
    const el = screen.getByTestId('probe');
    expect(el).toHaveClass('reveal');
    mockBox(2000, 0); // collapsed after mount
    act(() => {
      jest.advanceTimersByTime(3100);
    });
    expect(el.className).toBe('');
  });

  it('keeps a below-the-fold element hidden past the fallback while it still has a box', () => {
    jest.useFakeTimers();
    mockMatchMedia(false);
    mockBox(2000);
    mockIO();
    render(<Probe to={5} />);
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByTestId('probe')).toHaveClass('reveal');
  });
});
