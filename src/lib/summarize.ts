// Normalizes article text into a short, consistent summary.
//
// The RSS pipeline that feeds QA News (ChiefofStaff repo) does not always
// supply a summary sized for the UI — some feed descriptions run well past
// 150 characters. This util trims text down to 2-3 sentences within a
// character budget so summaries render consistently across TopPickCard and
// the article list, regardless of how long the upstream text was.

/**
 * Generate a short summary (2-3 sentences, capped at `maxLength` characters)
 * from a block of text. Falls back to a truncated excerpt if no sentence
 * boundaries fit within the budget.
 */
export function generateSummary(content: string, maxLength: number = 150): string {
  if (!content) return '';

  // Split by sentences (period, exclamation, question mark)
  const sentences = content
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Take first 2-3 sentences until we hit max length
  let summary = '';
  for (let i = 0; i < Math.min(sentences.length, 3); i++) {
    if (summary.length + sentences[i].length + 2 > maxLength) break;
    summary += (summary ? ' ' : '') + sentences[i] + '.';
  }

  if (!summary) {
    // Back off to the last whitespace boundary before maxLength so we
    // never cut a word in half.
    const truncated = content.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    const safeEnd = lastSpace > 0 ? lastSpace : maxLength;
    return content.substring(0, safeEnd).trim() + '...';
  }

  return summary;
}
