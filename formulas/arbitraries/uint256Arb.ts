import { bigInt } from 'fast-check'
import { uint256Max } from '../../../bn/constants'

export const uint256Arb = bigInt({
  min: 0n,
  max: uint256Max.toBigInt(),
})
