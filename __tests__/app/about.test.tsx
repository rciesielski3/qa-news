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
    expect(screen.getByRole('heading', { name: 'What Is QA News' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Our Mission' })).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/PAIOS/i);
  });
});
