import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionNav from '@/components/SectionNav';

const items = [
  { id: 'picks', no: '01', label: 'Top picks', count: 3 },
  { id: 'feed', no: '02', label: 'Pipeline', count: 14 },
  { id: 'repos', no: '03', label: 'New repos', count: 6 },
];

type IOCallback = (entries: Array<Partial<IntersectionObserverEntry>>) => void;
let callback: IOCallback | null = null;
const original = global.IntersectionObserver;

beforeEach(() => {
  callback = null;
  global.IntersectionObserver = class {
    constructor(cb: IOCallback) {
      callback = cb;
    }
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
  items.forEach((item) => {
    const el = document.createElement('section');
    el.id = item.id;
    document.body.appendChild(el);
  });
});

afterEach(() => {
  global.IntersectionObserver = original;
  document.body.innerHTML = '';
});

describe('SectionNav', () => {
  it('renders one anchor link per section with number, label and count', () => {
    render(<SectionNav items={items} />);
    const link = screen.getByRole('link', { name: /Top picks/ });
    expect(link).toHaveAttribute('href', '#picks');
    expect(link).toHaveTextContent('01');
    expect(link).toHaveTextContent('3');
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
  });

  it('marks no link current before any section is seen', () => {
    render(<SectionNav items={items} />);
    screen.getAllByRole('link').forEach((a) => expect(a).not.toHaveAttribute('aria-current'));
  });

  it('scroll-spy marks the intersecting section as current and moves with the scroll', () => {
    render(<SectionNav items={items} />);
    act(() => {
      callback?.([{ isIntersecting: true, target: document.getElementById('feed')! }]);
    });
    expect(screen.getByRole('link', { name: /Pipeline/ })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: /Pipeline/ })).toHaveClass('on');
    expect(screen.getByRole('link', { name: /Top picks/ })).not.toHaveAttribute('aria-current');

    act(() => {
      callback?.([{ isIntersecting: true, target: document.getElementById('repos')! }]);
    });
    expect(screen.getByRole('link', { name: /New repos/ })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: /Pipeline/ })).not.toHaveAttribute('aria-current');
  });

  it('ignores sections that leave the viewport', () => {
    render(<SectionNav items={items} />);
    act(() => {
      callback?.([{ isIntersecting: false, target: document.getElementById('feed')! }]);
    });
    screen.getAllByRole('link').forEach((a) => expect(a).not.toHaveAttribute('aria-current'));
  });

  it('marks a link current immediately when clicked', () => {
    render(<SectionNav items={items} />);
    fireEvent.click(screen.getByRole('link', { name: /New repos/ }));
    expect(screen.getByRole('link', { name: /New repos/ })).toHaveAttribute('aria-current', 'location');
  });
});
