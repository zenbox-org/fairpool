import { bigInt } from 'fast-check'
import { parseBaseLimit } from '../models/BaseLimit'
import { baseLimitMax, baseLimitMin } from '../models/BaseLimit/constants'

export const baseLimitArb = bigInt({
  min: baseLimitMin,
  max: baseLimitMax,
}).map(parseBaseLimit)
