import { record } from 'fast-check'
import { clampBaseDeltaRaw } from '../helpers/clampBaseDeltaRaw'
import { priceParamsArb } from './priceParamsArb'
import { uint256Arb } from './uint256Arb'

export const supplyStatArb = record({
  params: priceParamsArb,
  supply: uint256Arb,
}).map(({
  params: {
    baseLimit,
    quoteOffset,
  },
  supply,
}) => ({
  baseLimit,
  quoteOffset,
  supply: clampBaseDeltaRaw(baseLimit)(supply),
}))
