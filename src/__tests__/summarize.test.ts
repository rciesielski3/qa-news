import { generateSummary, getArticleSubtitle } from '@/lib/summarize';

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

describe('getArticleSubtitle', () => {
  it('prefers an explicit subtitle over summary', () => {
    expect(
      getArticleSubtitle({ subtitle: 'Explicit subtitle.', summary: 'Summary text that is long enough.' }),
    ).toBe('Explicit subtitle.');
  });

  it('falls through to summary when subtitle is whitespace only', () => {
    expect(
      getArticleSubtitle({ subtitle: '   ', summary: 'Summary text that is long enough.' }),
    ).toBe('Summary text that is long enough.');
  });

  it('strips a trailing "..." from summary', () => {
    expect(getArticleSubtitle({ summary: 'Truncated upstream text...' })).toBe('Truncated upstream text');
  });

  it('strips a trailing "…" from summary', () => {
    expect(getArticleSubtitle({ summary: 'Truncated upstream text…' })).toBe('Truncated upstream text');
  });

  it('returns empty string for text under 10 characters', () => {
    expect(getArticleSubtitle({ summary: 'Comments' })).toBe('');
  });

  it('returns empty string when summary is undefined', () => {
    expect(getArticleSubtitle({})).toBe('');
  });

  it('caps the subtitle at two sentences', () => {
    expect(
      getArticleSubtitle({ summary: 'First sentence here. Second sentence here. Third sentence here.' }),
    ).toBe('First sentence here. Second sentence here.');
  });

  it('does not split on periods inside abbreviations or version numbers', () => {
    expect(
      getArticleSubtitle({ summary: 'Release v2.0 reached the U.S. market this week.' }),
    ).toBe('Release v2.0 reached the U.S. market this week.');
  });

  it('returns empty string when the subtitle equals the title (case-insensitive, trimmed)', () => {
    expect(
      getArticleSubtitle({ title: '  Same Headline Here ', summary: 'same headline here' }),
    ).toBe('');
    expect(
      getArticleSubtitle({ title: 'Same Headline Here', subtitle: 'SAME HEADLINE HERE' }),
    ).toBe('');
  });

  it('keeps the subtitle when it differs from the title', () => {
    expect(
      getArticleSubtitle({ title: 'Headline', summary: 'A different body of text.' }),
    ).toBe('A different body of text.');
  });
});
