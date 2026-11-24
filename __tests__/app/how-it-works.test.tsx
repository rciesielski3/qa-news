import { render, screen } from '@testing-library/react';
import HowItWorksPage, { metadata } from '@/app/how-it-works/page';

describe('How it works page', () => {
  it('sets metadata without the retired PAIOS name', () => {
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(JSON.stringify(metadata)).not.toMatch(/PAIOS/i);
  });

  it('renders headings and no PAIOS reference', () => {
    const { container } = render(<HowItWorksPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'How QA News Curates the News' }),
    ).toBeInTheDocument();
    for (const name of ['Pipeline', 'Scoring', 'Key numbers', 'FAQ']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.queryByRole('heading', { name: 'Under the Hood' })).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/PAIOS/i);
  });
});
