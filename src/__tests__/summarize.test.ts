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

  it('derives the subtitle from description when subtitle is missing', () => {
    expect(
      getArticleSubtitle({ description: 'Description text here. Second sentence here. Third one.', summary: 'Summary text here.' }),
    ).toBe('Description text here. Second sentence here.');
  });

  it('uses summary only when description is missing', () => {
    expect(
      getArticleSubtitle({ description: '   ', summary: 'Summary text that is long enough.' }),
    ).toBe('Summary text that is long enough.');
    expect(
      getArticleSubtitle({ description: 'Hi.', summary: 'Summary text that is long enough.' }),
    ).toBe('');
  });

  it('prefers an explicit subtitle over description', () => {
    expect(
      getArticleSubtitle({ subtitle: 'Explicit subtitle.', description: 'Description text here.' }),
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
      getArticleSubtitle({
        summary: 'Dr. Lee shipped v2.0 in the U.S. today. J. Doe agreed with e.g. the plan. Third one here.',
      }),
    ).toBe('Dr. Lee shipped v2.0 in the U.S. today. J. Doe agreed with e.g. the plan.');
  });

  it('keeps the second real sentence when the first contains an abbreviation', () => {
    expect(
      getArticleSubtitle({ summary: 'The U.S. team shipped v2.0 today. It was a large release. Third one here.' }),
    ).toBe('The U.S. team shipped v2.0 today. It was a large release.');
  });

  it('does not return punctuation-only text', () => {
    expect(getArticleSubtitle({ summary: '!!!!!!!!!!!!!!' })).toBe('');
  });

  it('handles a 100k-character run of dots quickly', () => {
    const start = Date.now();
    expect(getArticleSubtitle({ summary: '.'.repeat(100000) })).toBe('');
    expect(Date.now() - start).toBeLessThan(500);
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
