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

/**
 * Subtitle shown under an article title: the first 1-2 sentences of the
 * article's own text. Prefers an explicit `subtitle`; otherwise derives one
 * from `summary`. Returns '' when there is nothing meaningful to show
 * (no text, too short, or the same text as the title).
 *
 * A sentence ends at [.!?]+ only when followed by whitespace or end of text,
 * so "U.S." and "v2.0" stay intact. Abbreviations followed by a space
 * (e.g. "Dr. Smith") still end a sentence; no abbreviation list is kept.
 */
export function getArticleSubtitle(article: {
  title?: string;
  subtitle?: string;
  summary?: string;
}): string {
  const explicit = article.subtitle?.trim();
  const derived = explicit || deriveSubtitle(article.summary);

  if (!derived) return '';
  if (article.title && derived.toLowerCase() === article.title.trim().toLowerCase()) return '';
  return derived;
}

function deriveSubtitle(summary: string | undefined): string {
  // Drop trailing ellipsis left by upstream truncation before splitting.
  const text = (summary ?? '').replace(/\.{3}\s*$|…\s*$/, '').trim();
  if (text.length < 10) return '';

  const sentences = text.match(/[\s\S]+?(?:[.!?]+(?=\s|$)|$)/g) ?? [];

  return sentences
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 2)
    .join(' ');
}
