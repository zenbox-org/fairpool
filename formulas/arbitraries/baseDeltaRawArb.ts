import { bigInt } from 'fast-check'
import { parseBaseDelta } from '../models/BaseDelta'
import { baseLimitMax } from '../models/BaseLimit/constants'

export const baseDeltaRawArb = bigInt({
  min: 1n,
  max: baseLimitMax - 1n,
}).map(parseBaseDelta)
