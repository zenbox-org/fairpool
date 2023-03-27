import { BigIntAdvancedOperations } from '../../utils/bigint/BigIntAdvancedOperations'
import { BigIntBasicArithmetic } from '../../utils/bigint/BigIntBasicArithmetic'
import { getQuoteDeltaMinF } from './model'
import { parseFairpool } from './models/Fairpool'
import { scaleFixed } from './models/Fairpool/constants'
import { quoteOffsetMin } from './models/QuoteOffset/constants'
import { State } from './models/State'
import { arst, blockchainZero } from './zero'

const { zero, one, fromNumber, add, sub, mul, div, mod, min, max, abs, sqrt, eq, lt, gt, lte, gte } = BigIntBasicArithmetic
const { sum, sumAmounts, halve, clamp, clampIn, getShare, getDeltas } = BigIntAdvancedOperations

export const usersDefault = ['alice', 'bob', 'sam', 'ted', 'owner']

export const addressesDefault = ['contract', ...usersDefault]

export const assetsDefault = ['base', 'quote']

export const [contract, alice, bob, sam, ted, owner] = addressesDefault

export const [base, quote] = assetsDefault

export const getShareScaledDefault = getShare(scaleFixed)

export const getShareScaledDefaultPips = getShareScaledDefault(fromNumber(10000))

export const fairpoolDefault = parseFairpool({
  ...arst,
  quoteOffset: 2n * quoteOffsetMin,
  address: contract,
  quoteSupply: zero,
  owner: sam,
  operator: ted,
  holdersPerDistributionMax: 256n,
})

export const stateDefault: State = {
  blockchain: blockchainZero,
  fairpools: [fairpoolDefault],
}

export const quoteDeltaDefault = getQuoteDeltaMinF(fairpoolDefault)
