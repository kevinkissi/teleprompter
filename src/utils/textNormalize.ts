/**
 * Normalize pasted / imported text while preserving paragraph structure.
 * - Unifies newlines
 * - Trims trailing whitespace on each line
 * - Collapses runs of >2 blank lines to a single blank line (paragraph break)
 * - Collapses runs of spaces/tabs to a single space
 * - Converts non-breaking spaces to regular spaces
 */
export function normalizeText(input: string): string {
  return input
    .replace(/\u00A0/g, ' ')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Derive a short title from the first non-empty line of a script body. */
export function deriveTitle(body: string, fallback = 'Untitled script'): string {
  const firstLine = body
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length > 0)
  if (!firstLine) return fallback
  return firstLine.length > 60 ? firstLine.slice(0, 57).trimEnd() + '…' : firstLine
}
