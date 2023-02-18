import { Arithmetic } from '../../../utils/arithmetic'
import { getQuotientOf } from '../../../utils/arithmetic/getQuotientOf'
import { Quotient } from '../../../utils/arithmetic/Quotient'
import { assertBy } from '../../../utils/assert'

/**
 * Produces an array of values where:
 * - each value >= valueMin
 * - sum of values <= sumMax (which implies that each value <= sumMax, too)
 */
export const toBoundedArray = <N>(arithmetic: Arithmetic<N>) => (valueMin: N, sumMax: N) => (quotients: Quotient<N>[]) => {
  const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
  const sumMin = mul(valueMin, num(quotients.length))
  const sumMaxLocal = sub(sumMax, sumMin)
  const getQuotientArith = getQuotientOf(arithmetic)
  assertBy(gt)(sumMaxLocal, zero, 'sumMaxLocal', 'zero')
  return quotients.map(quotient => add(getQuotientArith(quotient)(sumMaxLocal), valueMin))
}
