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

export interface InlineParse {
  tokens: InlineToken[]
  /** True when the run ends while still inside an unclosed emphasis span. */
  endEm: boolean
}

/**
 * Split a spoken paragraph into plain / emphasised inline tokens.
 *
 * `startEm` seeds the emphasis state. Slide Mode can only split a sentence that
 * physically cannot fit the lens window, and the least-bad place to do that is
 * sometimes inside an emphasis span; the slide that continues it is rendered
 * with `startEm: true` so the phrase keeps its weight across the break instead
 * of half of it going plain. Every character is still present, in order.
 */
export function parseInline(paragraph: string, startEm = false, endEm?: boolean): InlineParse {
  const marks: number[] = []
  const re = /\*\*/g
  let m: RegExpExecArray | null
  while ((m = re.exec(paragraph)) !== null) marks.push(m.index)

  // How many markers can be real, given where the run starts and ends.
  //
  // A whole paragraph starts and ends outside any span, so an odd marker is
  // genuinely unbalanced and renders literally — that is the default, and it is
  // what the scrolling reader has always done. A SLIDE is different: it can both
  // begin and end mid-span, and the segmenter knows which. Told that, the
  // markers it does contain are all real, so a slide that opens a span keeps its
  // emphasis to the end instead of printing two asterisks on the lens.
  // `****` is not an empty emphasis span, it is four characters somebody typed.
  // Drop adjacent pairs before pairing the rest, so they render as themselves.
  const toggles = new Array<boolean>(marks.length).fill(false)
  const candidates: number[] = []
  for (let k = 0; k < marks.length; k++) {
    if (k + 1 < marks.length && marks[k + 1] === marks[k] + 2) {
      k++
      continue
    }
    candidates.push(k)
  }
  const odd = startEm !== (endEm ?? false)
  const usable =
    candidates.length % 2 === (odd ? 1 : 0) ? candidates.length : Math.max(0, candidates.length - 1)
  for (let i = 0; i < usable; i++) toggles[candidates[i]] = true

  const tokens: InlineToken[] = []
  const push = (text: string, em: boolean) => {
    if (text.length === 0) return
    const prev = tokens[tokens.length - 1]
    if (prev && prev.em === em) prev.text += text
    else tokens.push({ text, em })
  }

  let em = startEm
  let last = 0
  for (let k = 0; k < marks.length; k++) {
    const at = marks[k]
    push(paragraph.slice(last, at), em)
    if (toggles[k]) em = !em
    else push('**', em) // unbalanced: show the characters, don't eat them
    last = at + 2
  }
  push(paragraph.slice(last), em)
  return { tokens, endEm: em }
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
