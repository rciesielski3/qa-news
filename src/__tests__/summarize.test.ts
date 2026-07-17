import { generateSummary } from '@/lib/summarize';

describe('generateSummary', () => {
  it('returns empty string for empty input', () => {
    expect(generateSummary('')).toBe('');
  });

  it('returns joined sentences for short multi-sentence content', () => {
    const content = 'First sentence. Second sentence. Third sentence.';
    const result = generateSummary(content, 150);
    expect(result).toContain('First sentence.');
    expect(result).toContain('Second sentence.');
    expect(result).not.toContain('...');
  });

  it('truncates long single sentence without cutting words mid-word', () => {
    const content =
      'This is a very long sentence that contains many words and should be truncated at a word boundary to avoid cutting words in the middle of the text.';
    const result = generateSummary(content, 50);

    expect(result.endsWith('...')).toBe(true);

    // The character immediately after the truncated text in the original
    // content must be a space (or end of string) — never a mid-word cut.
    const withoutEllipsis = result.slice(0, -3).trim();
    const boundaryChar = content.charAt(withoutEllipsis.length);
    expect(boundaryChar === '' || boundaryChar === ' ').toBe(true);
  });

  it('handles content with no sentence boundaries using fallback', () => {
    const content =
      'No-sentence-boundaries-here-just-one-long-word-that-exceeds-max-length-significantly';
    const result = generateSummary(content, 50);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(54); // 50 + '...'
  });

  it('respects custom maxLength parameter', () => {
    const content = 'This is a test sentence. Another sentence here.';
    const result = generateSummary(content, 30);
    expect(result.length).toBeLessThanOrEqual(34); // 30 + '...'
  });
});
