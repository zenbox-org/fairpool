import { bigInt } from 'fast-check'
import { uint256MaxN } from '../../../ethereum/constants'

export const uint256Arb = bigInt({
  min: 0n,
  max: uint256MaxN,
})
