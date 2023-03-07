import { assert, BigIntBasicArithmetic, BigIntBasicOperations } from '../../../utils/bigint.arithmetic'
import { every } from '../../../utils/remeda/every'
import { Share } from '../uni'

const { lte } = BigIntBasicArithmetic
const { sum } = BigIntBasicOperations

export const validateShares = (scale: bigint) => (shares: Share[]) => {
  const rootNumeratorsSum = sum(shares.map(s => s.rootNumerator))
  const subRootNumeratorsSums = shares.map(s => s.rootReferralNumerator + s.rootDiscountNumerator)
  assert.lte(rootNumeratorsSum, scale, 'rootNumeratorsSum', 'scale')
  assert.oneBy(every(lte(scale)), 'every(lte(scale))')(subRootNumeratorsSums, 'subRootNumeratorsSums')
  return shares
}

// export const validateLanes = (scale: bigint) => (lanes: Share[]) => {
//   const quotients = lanes.map(l => l.root)
//   const denominators = quotients.map(q => q.denominator)
//   assertByUnary(isValidQuotientSum(BigIntBasicArithmetic))(quotients)
//   assertByUnary(every(equals(scale)))(denominators)
//   return lanes
// }
