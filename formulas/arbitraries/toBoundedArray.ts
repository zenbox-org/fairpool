import { Arithmetic } from '../../../utils/arithmetic'
import { getQuotientOf } from '../../../utils/arithmetic/getQuotientOf'
import { Quotient } from '../../../utils/arithmetic/Quotient'
import { assertByBinary } from '../../../utils/assert'

/**
 * Produces an array of values where:
 * - each value >= valueMin
 * - sum of values <= sumMax (which implies that each value <= sumMax, too)
 *
 * IMPORTANT: the second parameter is valueSumMax, not valueMax
 */
export const toBoundedArray = <N>(arithmetic: Arithmetic<N>) => (valueMin: N, valueSumMax: N) => (quotients: Quotient<N>[]) => {
  const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
  const valueSumMin = mul(valueMin, num(quotients.length))
  const valueSumMaxLocal = sub(valueSumMax, valueSumMin)
  const getQuotientArith = getQuotientOf(arithmetic)
  assertByBinary(gt)(valueSumMaxLocal, zero, 'valueSumMaxLocal', 'zero')
  return quotients.map(quotient => add(getQuotientArith(quotient)(valueSumMaxLocal), valueMin))
}
