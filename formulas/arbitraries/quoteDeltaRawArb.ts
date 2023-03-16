import { bigInt } from 'fast-check'
import { uint256MaxN } from '../../../ethereum/constants'

export const quoteDeltaRawArb = bigInt({
  min: 0n,
  max: uint256MaxN,
})
