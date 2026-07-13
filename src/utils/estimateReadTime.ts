import { spokenText } from './prompterFormat'

/**
 * Count spoken words (runs of non-whitespace). Director cues ([...] lines) and
 * emphasis markers (**) are stripped first so they never distort word count,
 * read-time, or scroll pace.
 */
export function countWords(text: string): number {
  const matches = spokenText(text).match(/\S+/g)
  return matches ? matches.length : 0
}

export function countCharacters(text: string): number {
  return text.length
}

/** Estimated reading time in seconds for the given words-per-minute. */
export function estimateReadTimeSeconds(text: string, wpm: number): number {
  const words = countWords(text)
  if (wpm <= 0) return 0
  return Math.round((words / wpm) * 60)
}

/** Format seconds as m:ss (or h:mm:ss when >= 1 hour). */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = s % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`
  return `${minutes}:${pad(seconds)}`
}
