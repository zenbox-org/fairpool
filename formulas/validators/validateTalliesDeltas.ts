import { assert, BigIntBasicArithmetic } from '../../../utils/bigint/BigIntBasicArithmetic'
import { BigIntBasicOperations } from '../../../utils/bigint/BigIntBasicOperations'
import { TalliesDelta } from '../models/TalliesDelta'

const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = BigIntBasicArithmetic
const { sum } = BigIntBasicOperations

export const validateTalliesDeltas = (deltas: TalliesDelta[]) => {
  assert.gt(num(deltas.length), zero, 'num(deltas.length)', 'zero')
  return deltas.map(validateTalliesDelta)
}

export const validateTalliesDelta = (delta: TalliesDelta) => {
  assert.gt(delta.amount, zero, 'delta.amount', 'zero')
  return delta
}

// export const validateLanes = (scale: bigint) => (lanes: Share[]) => {
//   const quotients = lanes.map(l => l.root)
//   const denominators = quotients.map(q => q.denominator)
//   assertByUnary(isValidQuotientSum(BigIntBasicArithmetic))(quotients)
//   assertByUnary(every(equals(scale)))(denominators)
//   return lanes
// }
