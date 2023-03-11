import { BigIntBasicArithmetic } from '../../utils/bigint/BigIntBasicArithmetic'
import { BigIntBasicOperations } from '../../utils/bigint/BigIntBasicOperations'
import { quoteOffsetMin, scaleFixed } from './constants'
import { Fairpool, getQuoteDeltaMinF, State } from './uni'
import { validateFairpool } from './validators/validateFairpool'
import { balancesZero, blockchainZero, fairpoolZero } from './zero'

const { zero, one, num, add, sub, mul, div, mod, min, max, abs, sqrt, eq, lt, gt, lte, gte } = BigIntBasicArithmetic
const { sum, sumAmounts, halve, clamp, clampIn, getShare, getDeltas } = BigIntBasicOperations

export const usersDefault = ['alice', 'bob', 'sam', 'ted']

export const addressesDefault = ['contract', ...usersDefault]

export const assetsDefault = ['base', 'quote']

export const [contract, alice, bob, sam, ted] = addressesDefault

export const [base, quote] = assetsDefault

export const getShareScaledDefault = getShare(scaleFixed)

export const getShareScaledDefaultPips = getShareScaledDefault(num(10000))

export const fairpoolDefault: Fairpool = validateFairpool(balancesZero)({
  ...fairpoolZero,
  quoteOffset: 2n * quoteOffsetMin,
  address: contract,
  quoteSupply: zero,
  owner: sam,
  operator: ted,
  royalties: getShareScaledDefaultPips(num(2000)),
  earnings: getShareScaledDefaultPips(num(7500)),
  fees: getShareScaledDefaultPips(num(2500)),
  holdersPerDistributionMax: num(256),
})

export const stateDefault: State = {
  blockchain: blockchainZero,
  fairpools: [fairpoolDefault],
}

export const quoteDeltaDefault = getQuoteDeltaMinF(fairpoolDefault)
