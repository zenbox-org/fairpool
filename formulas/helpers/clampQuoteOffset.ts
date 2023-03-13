import { quoteOffsetMax, quoteOffsetMin } from '../constants'
import { clamp } from '../../../utils/bigint/BigIntBasicOperations'

export const clampQuoteOffset = clamp(quoteOffsetMin, quoteOffsetMax)
