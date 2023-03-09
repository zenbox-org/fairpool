import { BasicArithmetic } from '../../../utils/arithmetic'
import { assertByBinary } from '../../../utils/assert'
import { QuotientGen } from '../../../utils/Quotient'
import { getQuotientOf } from '../../../utils/Quotient/utils'

/**
 * Produces an array of values where:
 * - each value >= valueMin
 * - sum of values <= sumMax (which implies that each value <= sumMax, too)
 *
 * IMPORTANT: the second parameter is valueSumMax, not valueMax
 */
export const toBoundedArray = <N>(arithmetic: BasicArithmetic<N>) => (valueMin: N, valueSumMax: N) => (quotients: QuotientGen<N>[]) => {
  const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
  const valueSumMin = mul(valueMin, num(quotients.length))
  const valueSumMaxLocal = sub(valueSumMax, valueSumMin)
  const getQuotientArith = getQuotientOf(arithmetic)
  assertByBinary(gt)(valueSumMaxLocal, zero, 'valueSumMaxLocal', 'zero')
  return quotients.map(quotient => add(getQuotientArith(quotient)(valueSumMaxLocal), valueMin))
}
