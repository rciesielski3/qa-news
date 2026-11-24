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
    for (const name of ['From feed to page', 'Key decisions', 'Stack and quality']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    for (const gone of ['Signal versus noise', 'The solution at a glance', "What's next"]) {
      expect(screen.queryByRole('heading', { name: gone })).not.toBeInTheDocument();
    }
    expect(container.textContent).not.toMatch(/PAIOS/i);
  });
});
