import { tuple } from 'fast-check'
import { toSortedBaseLimitQuoteOffset } from '../helpers/toSortedBaseLimitQuoteOffset'
import { priceParamArb } from './priceParamArb'

export const priceParamsArb = tuple(priceParamArb, priceParamArb).map(toSortedBaseLimitQuoteOffset).map(([baseLimit, quoteOffset]) => ({
  baseLimit,
  quoteOffset,
}))
