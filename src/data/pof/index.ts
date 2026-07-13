import type { PofEpisode } from './types'
import { vol1 } from './vol1'
import { vol2 } from './vol2'
import { vol3 } from './vol3'
import { vol4 } from './vol4'
import { vol5 } from './vol5'
import { vol6 } from './vol6'
import { vol7 } from './vol7'
import { vol8 } from './vol8'
import { vol9 } from './vol9'

export type { PofEpisode }

/** All bundled "The Point of Failure" episodes, in production-book order. */
export const POF_EPISODES: PofEpisode[] = [
  ...vol1,
  ...vol2,
  ...vol3,
  ...vol4,
  ...vol5,
  ...vol6,
  ...vol7,
  ...vol8,
  ...vol9,
]
