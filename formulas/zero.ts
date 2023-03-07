import { writeFile } from 'fs/promises'
import { ZeroAddress } from '../../ethereum/data/allAddresses'
import { getGenMutilatorsWithAmount } from '../../finance/models/FintGen/getGenMutilatorsWithAmount'
import { BigIntAllAssertions, BigIntBasicArithmetic, BigIntBasicOperations } from '../../utils/bigint.arithmetic'
import { isLogEnabled } from '../../utils/debug'
import { BigIntQuotientFunctions } from './arbitraries/getQuotientFunctions'
import { baseLimitMin, holdersPerDistributionMaxFixed, quoteOffsetMin, scaleFixed } from './constants'
import { getExperimentOutputMin } from './experiments'
import { Fairpool } from './uni'
import { validateBalance } from './validators/validateBalance'
import { validateFairpool } from './validators/validateFairpool'
import { validatePricingParams } from './validators/validatePricingParams'

const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = BigIntBasicArithmetic
const { halve, sum, getShare } = BigIntBasicOperations
const { toQuotients, toBoundedArray, fromNumeratorsToValues } = BigIntQuotientFunctions
const { addB, subB, mulB, divB, sendB } = getGenMutilatorsWithAmount(BigIntBasicArithmetic)
const assert = BigIntAllAssertions
const getPercentOfScale = (numerator: bigint) => getShare(100n)(numerator)(scaleFixed)

if (isLogEnabled) await writeFile('/tmp/stats', getExperimentOutputMin())

export const balanceZero = validateBalance({
  address: ZeroAddress,
  amount: zero,
})

export const pricingParamsZero = validatePricingParams({
  baseLimit: baseLimitMin,
  quoteOffset: quoteOffsetMin,
})

export const fairpoolZero: Fairpool = validateFairpool([])({
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
  owner: ZeroAddress,
  operator: ZeroAddress,
  royalties: 0n,
  earnings: 0n,
  fees: 0n,
  holdersPerDistributionMax: holdersPerDistributionMaxFixed,
})
