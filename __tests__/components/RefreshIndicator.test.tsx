import { render, screen } from '@testing-library/react';
import RefreshIndicator from '@/components/RefreshIndicator';

describe('RefreshIndicator', () => {
  it('renders next refresh time', () => {
    render(<RefreshIndicator />);
    const text = screen.getByText(/Next refresh:/i);
    expect(text).toBeInTheDocument();
  });

  it('displays time format "Next refresh: X min (daily ~03:00 UTC)"', () => {
    render(<RefreshIndicator />);
    const text = screen.getByText(/Next refresh:.*\(daily ~03:00 UTC\)/);
    expect(text).toBeInTheDocument();
  });

  it('has accessible text styling', () => {
    render(<RefreshIndicator />);
    const text = screen.getByText(/Next refresh:/i);
    expect(text).toHaveClass('text-xs', 'text-center');
  });
});
