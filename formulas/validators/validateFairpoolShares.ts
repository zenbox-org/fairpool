import { assert, eq } from '../../../utils/bigint/BigIntBasicArithmetic'
import { every } from '../../../utils/remeda/every'
import { HieroShare, validateHieroShares } from '../models/HieroShare'

export const validateFairpoolShares = (scale: bigint) => (shares: HieroShare[]) => {
  const denominators = shares.map(s => s.quotient.denominator)
  assert.oneBy(every(eq(scale)), 'every(lte(scale))')(denominators, 'denominators')
  return validateHieroShares(shares)
}

// export const validateShares = (scale: bigint) => (shares: Share[]) => {
//   const rootNumeratorsSum = sum(shares.map(s => s.rootNumerator))
//   const subRootNumeratorsSums = shares.map(s => s.rootReferralNumerator + s.rootDiscountNumerator)
//   assert.lte(rootNumeratorsSum, scale, 'rootNumeratorsSum', 'scale')
//   assert.oneBy(every(lte(scale)), 'every(lte(scale))')(subRootNumeratorsSums, 'subRootNumeratorsSums')
//   return shares
// }

// export const validateLanes = (scale: bigint) => (lanes: Share[]) => {
//   const quotients = lanes.map(l => l.root)
//   const denominators = quotients.map(q => q.denominator)
//   assertByUnary(isValidQuotientSum(BigIntBasicArithmetic))(quotients)
//   assertByUnary(every(equals(scale)))(denominators)
//   return lanes
// }
