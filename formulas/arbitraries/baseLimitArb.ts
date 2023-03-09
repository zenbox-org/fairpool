import { bigInt } from 'fast-check'
import { baseLimitMax, baseLimitMin } from '../constants'

export const baseLimitArb = bigInt({
  min: baseLimitMin,
  max: baseLimitMax,
})
