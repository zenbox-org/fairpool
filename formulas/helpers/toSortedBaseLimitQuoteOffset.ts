// export const quoteOffsetMultiplierProposedArb = bigInt(quoteOffsetMultiplierConstraints)
// export const prePricingParamsArb = record<PrePricingParams>({
//   quoteOffsetMultiplierProposed: quoteOffsetMultiplierProposedArb,
//   baseLimit: baseLimitArb,
// })
import { sort } from 'remeda'
import { compareNumerals } from '../../../utils/numeral/sort'

export const toSortedBaseLimitQuoteOffset = sort<bigint>(compareNumerals)
