import { getShare } from '../../../utils/bigint/BigIntAdvancedOperations'
import { parseQuotientGenBigInt } from '../../../utils/Quotient'
import { scaleFixed } from '../models/Fairpool/constants'

export const getPercentOfScale = (numerator: bigint, denominator = 100n) => getShare(denominator)(numerator)(scaleFixed)

export const getScaledQuotient = (numerator: bigint) => parseQuotientGenBigInt({
  numerator,
  denominator: scaleFixed,
})

export const getPercentScaledQuotient = (numerator: bigint, denominator = 100n) => parseQuotientGenBigInt({
  numerator: getPercentOfScale(numerator, denominator),
  denominator: scaleFixed,
})
