import { bigInt } from 'fast-check'
import { quoteOffsetMax, quoteOffsetMin } from '../constants'

export const quoteOffsetArb = bigInt({
  min: quoteOffsetMin,
  max: quoteOffsetMax,
})
