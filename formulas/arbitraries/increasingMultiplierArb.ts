import { bigInt } from 'fast-check'
import { uint256Max } from '../../../bn/constants'

export const increasingMultiplierArb = bigInt({
  min: 2n,
  max: uint256Max.toBigInt(), /* should actually be smaller, but we don't know in advance */
})
