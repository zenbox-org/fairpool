import { tuple } from 'fast-check'
import { toSortedBaseLimitQuoteOffset } from '../helpers/toSortedBaseLimitQuoteOffset'
import { parsePriceParams } from '../models/PriceParams'
import { baseLimitArb } from './baseLimitArb'
import { quoteOffsetArb } from './quoteOffsetArb'

export const priceParamsArb = tuple(baseLimitArb, quoteOffsetArb).map(toSortedBaseLimitQuoteOffset).map(([baseLimit, quoteOffset]) => parsePriceParams({
  baseLimit,
  quoteOffset,
}))
