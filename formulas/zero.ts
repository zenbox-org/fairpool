import { writeFile } from 'fs/promises'
import { ZeroAddress } from '../../ethereum/data/allAddresses'
import { getGenMutilatorsWithAmount } from '../../finance/models/FintGen/getGenMutilatorsWithAmount'
import { getAssert } from '../../utils/arithmetic/getAssert'
import { halve as $halve } from '../../utils/arithmetic/halve'
import { BigIntArithmetic } from '../../utils/bigint.arithmetic'
import { isLogEnabled } from '../../utils/debug'
import { baseLimitMin, holdersPerDistributionMaxFixed, quoteOffsetMin, scaleFixed } from './constants'
import { getExperimentOutputMin } from './experiments'
import { Fairpool } from './uni'
import { validateBalance } from './validators/validateBalance'
import { validateFairpool } from './validators/validateFairpool'
import { validatePricingParams } from './validators/validatePricingParams'

const arithmetic = BigIntArithmetic
const assert = getAssert(arithmetic)
const halve = $halve(arithmetic)
const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
const { addB, subB, mulB, divB, sendB } = getGenMutilatorsWithAmount(arithmetic)

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
  beneficiaries: [{ address: ZeroAddress, share: scaleFixed }],
  scale: scaleFixed,
  owner: ZeroAddress,
  operator: ZeroAddress,
  royalties: 0n,
  earnings: 0n,
  fees: 0n,
  holdersPerDistributionMax: holdersPerDistributionMaxFixed,
})
