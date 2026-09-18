/**
 * Sentence boundaries for teleprompter script bodies.
 *
 * Slide Mode groups the script into slides without ever changing a word, so the
 * only thing it needs from the text is where one sentence ends and the next
 * begins. Getting that wrong is visible on camera — a slide that changes while
 * you are mid-clause — so the rules here are derived from the bundled series
 * itself rather than from a generic splitter.
 *
 * The one hazard that dominates is **emphasis**. A span like
 *
 *     **One. At. A. Time.**
 *
 * is a single delivered phrase whose internal periods are not boundaries, while
 * its FINAL period is one — and because the text reads `.**` there, a plain
 * /[.!?]\s+[A-Z]/ never fires at all. A hundred more sentences in the book
 * simply START with a `**`, which the same lookahead also misses.
 *
 * So the scan runs over a masked copy of the body: inside an emphasis span every
 * terminal mark is neutralised EXCEPT the span's last one. Offsets are preserved
 * exactly (mask is a character-for-character substitution), so every offset this
 * module returns indexes straight into the original body.
 */

/** A half-open span [start, end) of `body`. */
export interface Span {
  start: number
  end: number
}

/** Character used to neutralise punctuation in the masked copy. Not terminal,
 *  not whitespace, not an opener — so it can never create a false boundary. */
const MASK_CHAR = ''

/**
 * Every `**…**` emphasis span in `body`, INCLUDING the surrounding markers.
 * Unclosed `**` is ignored (it renders literally, so it is not a span).
 */
export function emphasisSpans(body: string): Span[] {
  const spans: Span[] = []
  const re = /\*\*([\s\S]+?)\*\*/g
  let m: RegExpExecArray | null
  while ((m = re.exec(body)) !== null) {
    spans.push({ start: m.index, end: m.index + m[0].length })
  }
  return spans
}

/** True when a break at `offset` would land strictly inside one of `spans`. */
export function insideSpan(spans: Span[], offset: number): boolean {
  for (const s of spans) if (offset > s.start && offset < s.end) return true
  return false
}

/**
 * A copy of `body`, same length, with terminal punctuation inside an emphasis
 * span replaced by MASK_CHAR — except the span's LAST terminal mark, which is a
 * real sentence end and must stay visible to the scanner.
 *
 *   "**One. At. A. Time.** The"  ->  "**One\x01 At\x01 A\x01 Time.** The"
 *                                            ^ masked      ^ kept
 */
export function maskEmphasis(body: string): string {
  const spans = emphasisSpans(body)
  if (spans.length === 0) return body
  const out = body.split('')
  for (const span of spans) {
    // Content sits between the two `**` markers.
    const contentStart = span.start + 2
    const contentEnd = span.end - 2
    // The last terminal mark in the content is the one that may end a sentence.
    let keep = -1
    for (let i = contentEnd - 1; i >= contentStart; i--) {
      const c = body[i]
      if (c === '.' || c === '!' || c === '?') {
        keep = i
        break
      }
      // Only trailing closers may sit after it; anything else and the span
      // does not end in punctuation at all.
      if (!/[)\]"'”’»…]/.test(c)) break
    }
    for (let i = contentStart; i < contentEnd; i++) {
      const c = body[i]
      if ((c === '.' || c === '!' || c === '?') && i !== keep) out[i] = MASK_CHAR
    }
  }
  return out.join('')
}

// A sentence may begin with a letter, a digit, an opening quote/bracket, or the
// `**` that opens an emphasis span — the last of these is the case a naive
// [A-Z] lookahead misses 100 times in the bundled series.
const SENTENCE_START = /[A-Z0-9"'“‘«([*]/
// Closers allowed between the terminal mark and the whitespace: quotes, brackets
// and the `**` that closes an emphasis span.
const CLOSERS = /[*"'”’»)\]]/

/**
 * Offsets in `body` at which a sentence ends — i.e. the index of the first
 * character of the NEXT sentence's leading whitespace. Returned sorted.
 *
 * Only genuinely ambiguous constructs are rejected:
 *  - an ellipsis ("…" or "...") is a held pause, never a sentence end;
 *  - "Arthur C. Clarke" — a lone capital letter before the period is an initial;
 *  - anything inside an emphasis span (handled by the mask, above).
 * Decimals and dotted abbreviations need no rule: their periods are never
 * followed by whitespace, so they can never match in the first place.
 */
export function sentenceEnds(body: string): number[] {
  const masked = maskEmphasis(body)
  const ends: number[] = []
  for (let i = 0; i < masked.length; i++) {
    const c = masked[i]
    if (c !== '.' && c !== '!' && c !== '?') continue

    // An ellipsis holds the thought open — never a boundary.
    if (c === '.' && (masked[i + 1] === '.' || masked[i - 1] === '.')) continue
    if (masked[i - 1] === '…') continue

    // Skip trailing closers (") ] ** …) to find the whitespace.
    let j = i + 1
    while (j < masked.length && CLOSERS.test(masked[j])) j++
    if (j >= masked.length) continue
    if (!/\s/.test(masked[j])) continue

    // The next non-space character must be able to open a sentence.
    let k = j
    while (k < masked.length && /\s/.test(masked[k])) k++
    if (k >= masked.length) continue
    if (!SENTENCE_START.test(masked[k])) continue

    // "Arthur C. Clarke" — a single capital preceded by a space is an initial.
    if (c === '.' && /[A-Z]/.test(masked[i - 1] ?? '') && /\s/.test(masked[i - 2] ?? ' ')) continue

    ends.push(j)
  }
  return ends
}

/**
 * Split `text` (a paragraph, given with its absolute `offset` into the body)
 * into abutting sentence spans. The spans PARTITION the paragraph: the first
 * starts at `offset`, each one ends exactly where the next begins, and the last
 * ends at `offset + text.length`. Trailing whitespace rides on the sentence
 * before it, so no character is ever orphaned between two spans.
 */
export function sentenceSpans(text: string, offset = 0): Span[] {
  if (text.length === 0) return []
  const ends = sentenceEnds(text)
  const spans: Span[] = []
  let start = 0
  for (const end of ends) {
    // Swallow the whitespace that follows the break so spans stay abutting.
    let e = end
    while (e < text.length && /\s/.test(text[e])) e++
    if (e <= start) continue
    spans.push({ start: offset + start, end: offset + e })
    start = e
  }
  if (start < text.length) spans.push({ start: offset + start, end: offset + text.length })
  return spans
}
