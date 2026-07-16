import {
  calculateArticlesPerPage,
  paginateArticles,
  getTotalPages,
  clampPageNumber,
} from '@/lib/pagination';

describe('pagination', () => {
  describe('calculateArticlesPerPage', () => {
    it('returns at least 3 articles', () => {
      const result = calculateArticlesPerPage(500);
      expect(result).toBeGreaterThanOrEqual(3);
    });

    it('scales with viewport height', () => {
      const small = calculateArticlesPerPage(600);
      const large = calculateArticlesPerPage(1200);
      expect(large).toBeGreaterThan(small);
    });
  });

  describe('paginateArticles', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    it('returns first page', () => {
      expect(paginateArticles(items, 1, 3)).toEqual([1, 2, 3]);
    });

    it('returns second page', () => {
      expect(paginateArticles(items, 2, 3)).toEqual([4, 5, 6]);
    });

    it('handles partial last page', () => {
      expect(paginateArticles(items, 4, 3)).toEqual([10]);
    });
  });

  describe('getTotalPages', () => {
    it('calculates total pages correctly', () => {
      expect(getTotalPages(10, 3)).toBe(4);
      expect(getTotalPages(9, 3)).toBe(3);
    });
  });

  describe('clampPageNumber', () => {
    it('clamps to valid range', () => {
      expect(clampPageNumber(0, 5)).toBe(1);
      expect(clampPageNumber(10, 5)).toBe(5);
      expect(clampPageNumber(3, 5)).toBe(3);
    });
  });
});
