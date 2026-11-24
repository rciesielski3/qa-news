import { fireEvent, render, screen } from '@testing-library/react';
import AboutPage from '@/app/about/page';
import HowItWorksPage from '@/app/how-it-works/page';
import FAQAccordion from '@/components/FAQAccordion';

describe('content pages share the Daily bento language', () => {
  it('How it works has a hero tile, numbered section heads and a section nav for every section', () => {
    const { container } = render(<HowItWorksPage />);
    expect(container.querySelector('.t-head h1')).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    const ids = Array.from(nav.querySelectorAll('a')).map((a) => a.getAttribute('href')?.slice(1));
    expect(ids).toEqual(['pipeline', 'metrics', 'scoring', 'hood', 'faq']);
    for (const id of ids) expect(container.querySelector(`section#${id}`)).toBeInTheDocument();
    expect(container.querySelectorAll('.sec-head')).toHaveLength(5);
    expect(container.querySelectorAll('.cp-step')).toHaveLength(4);
  });

  it('both pages link back to Daily, Weekly and Monthly', () => {
    for (const Page of [AboutPage, HowItWorksPage]) {
      const { container, unmount } = render(<Page />);
      const hrefs = Array.from(container.querySelectorAll('a.cp-cta-link')).map((a) => a.getAttribute('href'));
      expect(hrefs).toEqual(['/', '/weekly', '/monthly']);
      unmount();
    }
  });
});

describe('FAQAccordion accessibility', () => {
  it('toggles one answer at a time with aria-expanded / aria-controls', () => {
    render(<FAQAccordion />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.every((b) => b.getAttribute('aria-expanded') === 'false')).toBe(true);
    expect(buttons[0]).not.toHaveAttribute('aria-controls');

    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
    const panel = document.getElementById(buttons[0].getAttribute('aria-controls') as string);
    expect(panel).toHaveAttribute('role', 'region');
    expect(panel).toHaveAttribute('aria-labelledby', buttons[0].id);

    fireEvent.click(buttons[1]);
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(buttons[1]);
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'false');
  });
});
