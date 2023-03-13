import { writeFile } from 'fs/promises'
import { ZeroAddress } from '../../ethereum/data/allAddresses'
import { getGenMutilatorsWithAmount } from '../../finance/models/FintGen/getGenMutilatorsWithAmount'
import { BigIntAllAssertions, BigIntBasicArithmetic } from '../../utils/bigint/BigIntBasicArithmetic'
import { BigIntBasicOperations } from '../../utils/bigint/BigIntBasicOperations'
import { isLogEnabled } from '../../utils/debug'
import { baseLimitMin, holdersPerDistributionMaxFixed, quoteOffsetMin, scaleFixed } from './constants'
import { getExperimentOutputMin } from './experiments'
import { getPercentScaledQuotient } from './helpers/scale'
import { Balance as ImBalance } from './models/Balance'
import { BigIntQuotientFunctions } from './models/bigint/BigIntQuotientFunctions'
import { Blockchain, Fairpool } from './uni'
import { validateBalance } from './validators/validateBalance'
import { validateFairpoolFull } from './validators/validateFairpool'
import { validatePricingParams } from './validators/validatePricingParams'

const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = BigIntBasicArithmetic
const { halve, sum, getShare } = BigIntBasicOperations
const { getQuotientsFromNumberNumerators, getBoundedArrayFromQuotients, getValuesFromNumerators } = BigIntQuotientFunctions
const { addB, subB, mulB, divB, sendB } = getGenMutilatorsWithAmount(BigIntBasicArithmetic)
const assert = BigIntAllAssertions

if (isLogEnabled) await writeFile('/tmp/stats', getExperimentOutputMin())

export const balanceZero = validateBalance({
  address: ZeroAddress,
  amount: zero,
})

export const pricingParamsZero = validatePricingParams({
  baseLimit: baseLimitMin,
  quoteOffset: quoteOffsetMin,
})

export const fairpoolZero: Fairpool = validateFairpoolFull([])({
  address: ZeroAddress,
  ...pricingParamsZero,
  balances: [],
  tallies: [],
  quoteSupply: zero,
  shares: [
    // {
    //   rootNumerator: getPercentOfScale(10n),
    //   rootReferralNumerator: 0n,
    //   rootDiscountNumerator: 0n,
    //   referralsMap: {},
    //   isRecognizedReferralMap: {},
    // },
  ],
  scale: scaleFixed,
  seed: 0n,
  owner: ZeroAddress,
  operator: ZeroAddress,
  royalties: 0n,
  earnings: 0n,
  fees: 0n,
  holdersPerDistributionMax: holdersPerDistributionMaxFixed,
})

assert.eq(getPercentScaledQuotient(25n, 1000n).numerator, 25000n, 'getPercentScaledQuotient(10n).numerator', '100000n')

export const balancesZero: ImBalance[] = []

export const blockchainZero: Blockchain = {
  balances: balancesZero,
}

// const getTalliesDeltasWithReferrals: GetTalliesDeltasHierarchical = todo()

// const getSharesDefault = (marketerShare: Partial<ShareHierarchical>, developerShare: Partial<ShareHierarchical> & Pick<ShareHierarchical, 'recipient'>): ShareHierarchical[] => [
//   {
//     quotient: getPercentScaledQuotient(10n),
//     recipient: ZeroAddress,
//     referralsMap: {},
//     isRecognizedReferralMap: {},
//     getTalliesDeltas: getTalliesDeltasHolders,
//   },
//   {
//     quotient: getPercentScaledQuotient(7n),
//     referralsMap: {},
//     isRecognizedReferralMap: {},
//     getTalliesDeltas: getTalliesDeltasWithReferrals,
//   },
//   {
//     quotient: getPercentScaledQuotient(25n, 1000n),
//     referralsMap: {},
//     isRecognizedReferralMap: {},
//     getTalliesDeltas: todo(),
//     ...developerShare,
//   },
// ]
