// Text helpers for article summaries and subtitles in QA News.
//
// The RSS pipeline that feeds QA News (ChiefofStaff repo) does not always
// supply a summary sized for the UI, so some feed descriptions run well past
// 150 characters. `generateSummary` trims text to 2-3 sentences within a
// character budget. It is no longer used by app code (only its unit tests
// call it); `getArticleSubtitle` is what the UI uses.

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

/** Only the first part of a summary is scanned for sentences (bounds regex work). */
const SUBTITLE_SCAN_LIMIT = 1000;

/** Abbreviations whose period does not end a sentence (lowercase, without the trailing dot). */
const ABBREVIATIONS = new Set([
  'dr', 'mr', 'mrs', 'ms', 'prof', 'sr', 'jr', 'st', 'vs', 'etc', 'inc', 'ltd', 'co', 'no',
  'e.g', 'i.e',
]);

const LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;

/**
 * Subtitle shown under an article title: the first 1-2 sentences of the
 * article's own text. Prefers an explicit `subtitle`; otherwise derives one
 * from `description`, and falls back to `summary` only when there is no
 * description. Returns '' when there is nothing meaningful to show
 * (no text, too short, no letters or digits, or the same text as the title).
 */
export function getArticleSubtitle(article: {
  title?: string;
  subtitle?: string;
  description?: string;
  summary?: string;
}): string {
  const explicit = article.subtitle?.trim();
  const hasDescription = (article.description?.trim() ?? '') !== '';
  const derived = explicit || deriveSubtitle(hasDescription ? article.description : article.summary);

  if (!derived || !LETTER_OR_DIGIT.test(derived)) return '';
  if (article.title && derived.toLowerCase() === article.title.trim().toLowerCase()) return '';
  return derived;
}

function deriveSubtitle(summary: string | undefined): string {
  // Cap the input before matching; long punctuation runs make matching expensive.
  // Then drop trailing ellipsis left by upstream truncation.
  const text = (summary ?? '').slice(0, SUBTITLE_SCAN_LIMIT).replace(/\.{3}\s*$|…\s*$/, '').trim();
  if (text.length < 10) return '';

  return splitSentences(text).slice(0, 2).join(' ');
}

/**
 * Split at [.!?]+ followed by whitespace or end of text, except for a period
 * after an abbreviation or a single-letter initial ("U.S.", "J. Doe", "Dr. Smith").
 * Uses lookahead only, no lookbehind, for Safari compatibility.
 */
function splitSentences(text: string): string[] {
  const boundary = /[.!?]+(?=\s|$)/g;
  const sentences: string[] = [];
  let start = 0;
  let match: RegExpExecArray | null;

  while ((match = boundary.exec(text)) !== null) {
    if (match[0] === '.' && isNonTerminalPeriod(text, match.index)) continue;
    const end = match.index + match[0].length;
    sentences.push(text.slice(start, end));
    start = end;
  }
  if (start < text.length) sentences.push(text.slice(start));

  return sentences.map((s) => s.trim()).filter((s) => s.length > 0);
}

function isNonTerminalPeriod(text: string, periodIndex: number): boolean {
  // The word directly before the period, e.g. "U.S" or "Dr".
  let start = periodIndex;
  while (start > 0 && !/\s/.test(text[start - 1])) start--;
  const word = text.slice(start, periodIndex).replace(/^[^A-Za-z0-9]+/, '');

  // Single-letter initial ("J") or the last letter of "U.S" / "J.R".
  if (/(^|[^A-Za-z])[A-Z]$/.test(word)) return true;
  return ABBREVIATIONS.has(word.toLowerCase());
}
