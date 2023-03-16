import { baseLimitMax, baseLimitMin } from './models/BaseLimit/constants'
import { quoteOffsetMin } from './models/QuoteOffset/constants'

export const quoteOffsetMultiplierMin = quoteOffsetMin / baseLimitMin

export const quoteOffsetMultiplierMaxGetter = (baseLimit: bigint) => baseLimitMax / baseLimit
