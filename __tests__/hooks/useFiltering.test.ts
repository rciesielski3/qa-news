import { renderHook, act } from '@testing-library/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useFiltering } from '@/hooks/useFiltering';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

describe('useFiltering', () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    (usePathname as jest.Mock).mockReturnValue('/weekly');
  });

  it('updateFilters pushes the new URL with scroll: false', () => {
    const { result } = renderHook(() => useFiltering());

    act(() => {
      result.current.updateFilters({ category: 'ai' });
    });

    expect(push).toHaveBeenCalledWith('/weekly?category=ai', { scroll: false });
  });

  it('clearFilters pushes the bare path with scroll: false', () => {
    const { result } = renderHook(() => useFiltering());

    act(() => {
      result.current.clearFilters();
    });

    expect(push).toHaveBeenCalledWith('/weekly', { scroll: false });
  });
});
