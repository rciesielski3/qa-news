import { render, screen } from '@testing-library/react';
import AboutPage, { metadata } from '@/app/about/page';

describe('About page', () => {
  it('sets metadata without the retired PAIOS name', () => {
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(JSON.stringify(metadata)).not.toMatch(/PAIOS/i);
  });

  it('renders headings and no PAIOS reference', () => {
    const { container } = render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'About QA News' })).toBeInTheDocument();
    // The old two-paragraph page became a case study; its sections replace "What Is QA News" / "Our Mission".
    for (const name of ['Signal versus noise', 'The solution at a glance', 'From feed to page', 'Engineering decisions']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(container.textContent).not.toMatch(/PAIOS/i);
  });
});
