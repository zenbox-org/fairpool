import { bigInt } from 'fast-check'
import { uint256MaxN } from '../../../bn/constants'

export const increasingMultiplierArb = bigInt({
  min: 2n,
  max: uint256MaxN, /* should actually be smaller, but we don't know in advance */
})
