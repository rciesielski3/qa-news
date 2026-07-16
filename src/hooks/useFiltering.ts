'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { FilterState, parseFilterParams, serializeFilterParams } from '@/lib/filtering';

export function useFiltering() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return parseFilterParams(params);
  }, [searchParams]);

  const updateFilters = (newFilters: FilterState) => {
    const params = serializeFilterParams(newFilters);
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
  };

  const updateTags = (tags: string[]) => {
    updateFilters({ ...filters, tags });
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    updateTags(newTags);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return { filters, updateFilters, updateTags, toggleTag, clearFilters };
}
