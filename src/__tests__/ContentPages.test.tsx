import { fireEvent, render, screen } from '@testing-library/react';
import AboutPage, { metadata as aboutMetadata } from '@/app/about/page';
import HowItWorksPage, { metadata as howMetadata } from '@/app/how-it-works/page';
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

describe('About case study', () => {
  it('has one h1, a section nav matching the numbered sections and the expected case-study headings', () => {
    const { container } = render(<AboutPage />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    const ids = Array.from(nav.querySelectorAll('a')).map((a) => a.getAttribute('href')?.slice(1));
    expect(ids).toEqual(['problem', 'solution', 'architecture', 'decisions', 'quality', 'stack', 'next']);
    for (const id of ids) {
      const section = container.querySelector(`section#${id}`);
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('aria-labelledby', `${id}-title`);
      expect(container.querySelector(`#${id}-title`)).toBeInTheDocument();
    }
    expect(container.querySelectorAll('.sec-head')).toHaveLength(7);
    for (const name of ['Engineering decisions', 'The quality bar', 'Tech stack', "What's next"]) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
  });

  it('gives every engineering decision a why and a trade-off', () => {
    const { container } = render(<AboutPage />);
    const tiles = container.querySelectorAll('#decisions .cp-card');
    expect(tiles.length).toBeGreaterThanOrEqual(4);
    tiles.forEach((tile) => {
      const keys = Array.from(tile.querySelectorAll('.cp-k')).map((k) => k.textContent);
      expect(keys).toEqual(['Why', 'Trade-off']);
    });
  });

  it('describes the architecture in text: an ordered list of stages plus a caption', () => {
    const { container } = render(<AboutPage />);
    const figure = container.querySelector('figure.cp-arch') as HTMLElement;
    expect(figure).toHaveAttribute('aria-labelledby', 'arch-caption');
    expect(container.querySelector('#arch-caption')?.textContent).toMatch(/feeds go through the pipeline/i);
    const stages = Array.from(figure.querySelectorAll('.cp-arch-flow > li h3')).map((h) => h.textContent);
    expect(stages).toEqual(['Feeds', 'Pipeline', 'NDJSON in Git', 'JSON exports', 'Static site']);
    expect(figure.querySelector('svg')).toBeNull();
  });

  it('labels roadmap items with a status and links the contact page safely', () => {
    const { container } = render(<AboutPage />);
    const pills = Array.from(container.querySelectorAll('#next .cp-pill')).map((p) => p.textContent);
    expect(pills).toEqual(['Planned', 'Paused', 'Later']);
    const contact = screen.getByRole('link', { name: /get in touch/i });
    expect(contact).toHaveAttribute('href', 'https://rciesielski.dev/contact');
    expect(contact).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('keeps retired names and personal data out of both pages', () => {
    for (const Page of [AboutPage, HowItWorksPage]) {
      const { container, unmount } = render(<Page />);
      expect(container.textContent).not.toMatch(/paios/i);
      expect(container.textContent).not.toMatch(/@gmail|rafal|ciesielski/i);
      unmount();
    }
  });

  it('exports metadata for both pages', () => {
    expect(aboutMetadata.title).toMatch(/About QA News/);
    expect(aboutMetadata.description).toMatch(/QA and test-automation engineers/);
    expect(howMetadata.title).toMatch(/How It Works/);
  });
});

describe('How it works visuals', () => {
  it('has one h1, a score breakdown whose rows state their contribution as text, and links to About', () => {
    const { container } = render(<HowItWorksPage />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    const rows = Array.from(container.querySelectorAll('.cp-score-row'));
    expect(rows.map((r) => r.querySelector('.nm')?.textContent)).toEqual([
      'Base',
      'Core QA keywords',
      'Method keywords',
      'Context keywords',
      'Source prior',
      'Freshness',
    ]);
    rows.forEach((r) => {
      expect(r.querySelector('.val')?.textContent).toBeTruthy();
      expect(r.querySelector('.track')).toHaveAttribute('aria-hidden', 'true');
    });
    expect(container.querySelector('a[href="/about#architecture"]')).toBeInTheDocument();
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
