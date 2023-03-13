import { scaleFixed } from '../constants'
import { parseQuotientGenBigInt } from '../../../utils/Quotient'
import { getShare } from '../../../utils/bigint/BigIntBasicOperations'

export const getPercentOfScale = (numerator: bigint, denominator = 100n) => getShare(denominator)(numerator)(scaleFixed)

export const getScaledQuotient = (numerator: bigint) => parseQuotientGenBigInt({
  numerator,
  denominator: scaleFixed,
})

export const getPercentScaledQuotient = (numerator: bigint, denominator = 100n) => parseQuotientGenBigInt({
  numerator: getPercentOfScale(numerator, denominator),
  denominator: scaleFixed,
})
