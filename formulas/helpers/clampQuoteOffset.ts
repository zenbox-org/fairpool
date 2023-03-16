import { clamp } from '../../../utils/bigint/BigIntAdvancedOperations'
import { quoteOffsetMax, quoteOffsetMin } from '../models/QuoteOffset/constants'

export const clampQuoteOffset = clamp(quoteOffsetMin, quoteOffsetMax)
