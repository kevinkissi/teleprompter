/** One bundled "The Point of Failure" episode script. */
export interface PofEpisode {
  /** Stable id (never changes) so re-importing is idempotent, e.g. "pof-001". */
  id: string
  /** Production-book order; the library is sorted by this so filming batches stay together. */
  seq: number
  /** Library title, prefixed with the catalog number, e.g. "EP 1 · The Update…". */
  title: string
  /** Spoken text only, with **emphasis** and [cue] markup for the reader. */
  body: string
}
