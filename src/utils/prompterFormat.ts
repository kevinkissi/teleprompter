/**
 * Lightweight reading markup for teleprompter script bodies.
 *
 * Authoring convention (used by the bundled scripts, and available to you):
 *   **word**   → EMPHASIS. Rendered bold + slightly larger so it pops while you read
 *                (a word/number/phrase to punch).
 *   [ cue ]    → a whole line wrapped in square brackets is a DIRECTOR CUE — a beat,
 *                a rest, a tone note. Rendered dim + small; it is NOT spoken, and it is
 *                NOT counted toward your reading pace.
 *
 * Everything else is spoken text. Beats are separated by a blank line so the reader
 * gives you a natural breath between them.
 */

export interface InlineToken {
  text: string
  em: boolean
}

/** A line/paragraph that is entirely a bracketed director cue, e.g. "[beat]". */
const CUE_RE = /^\s*\[[^\]]*\]\s*$/

export function isCueParagraph(paragraph: string): boolean {
  return CUE_RE.test(paragraph)
}

/** The inner text of a cue paragraph, with the surrounding brackets removed. */
export function cueText(paragraph: string): string {
  return paragraph.trim().replace(/^\[/, '').replace(/\]$/, '').trim()
}

/** Split a spoken paragraph into plain / emphasised inline tokens. */
export function parseInline(paragraph: string): InlineToken[] {
  const tokens: InlineToken[] = []
  const re = /\*\*([\s\S]+?)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(paragraph)) !== null) {
    if (m.index > last) tokens.push({ text: paragraph.slice(last, m.index), em: false })
    tokens.push({ text: m[1], em: true })
    last = m.index + m[0].length
  }
  if (last < paragraph.length) tokens.push({ text: paragraph.slice(last), em: false })
  return tokens
}

/**
 * Spoken-only text: drops director-cue lines and emphasis markers. Used for word
 * count / read-time / scroll pace so the cues and `**` never distort your timing.
 */
export function spokenText(body: string): string {
  return body
    .split('\n')
    .filter((line) => !CUE_RE.test(line))
    .join('\n')
    .replace(/\*\*/g, '')
}
