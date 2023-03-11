import { bigInt } from 'fast-check'
import { uint256MaxN } from '../../../bn/constants'

export const quoteDeltaRawArb = bigInt({
  min: 0n,
  max: uint256MaxN,
})
