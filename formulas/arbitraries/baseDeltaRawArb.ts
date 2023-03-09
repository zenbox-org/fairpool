import { bigInt } from 'fast-check'
import { baseLimitMax } from '../constants'

export const baseDeltaRawArb = bigInt({
  min: 1n,
  max: baseLimitMax - 1n,
})
