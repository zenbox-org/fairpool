import { bigInt } from 'fast-check'
import { parseQuoteOffset } from '../models/QuoteOffset'
import { quoteOffsetMax, quoteOffsetMin } from '../models/QuoteOffset/constants'

export const quoteOffsetArb = bigInt({
  min: quoteOffsetMin,
  max: quoteOffsetMax,
}).map(parseQuoteOffset)
