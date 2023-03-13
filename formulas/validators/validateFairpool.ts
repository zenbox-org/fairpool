import { assert } from '../../../utils/bigint/BigIntBasicArithmetic'
import { isEqualBy } from '../../../utils/lodash'
import { getAmountD, getTotalSupply } from '../helpers'
import { Balance as ImBalance } from '../models/Balance'
import { Fairpool, getBaseSupplyF, getQuoteSupplyF } from '../uni'
import { validateBalances } from './validateBalance'
import { validateFairpoolShares } from './validateFairpoolShares'
import { validatePricingParams } from './validatePricingParams'

export const validateFairpool = (fairpoolIn: Fairpool) => {
  const fairpool = validatePricingParams(fairpoolIn)
  validateBalances(fairpool.balances)
  validateBalances(fairpool.tallies)
  validateFairpoolShares(fairpool.scale)(fairpool.shares)
  assert.lte(fairpool.holdersPerDistributionMax, BigInt(Number.MAX_SAFE_INTEGER), 'fairpool.holdersPerDistributionMax', 'BigInt(Number.MAX_SAFE_INTEGER)', {}, 'Required for range() in getTalliesDelta()')
  const baseSupplyActual = getTotalSupply(fairpool.balances)
  const quoteSupplyActual = fairpool.quoteSupply
  const baseSupplyExpected = getBaseSupplyF(fairpool)(quoteSupplyActual)
  const quoteSupplyExpected = getQuoteSupplyF(fairpool)(baseSupplyActual)
  // inter(__filename, validateBalances, { baseSupplyActual, baseSupplyExpected })
  // inter(__filename, validateBalances, { quoteSupplyActual, quoteSupplyExpected })
  assert.gte(baseSupplyActual, baseSupplyExpected, 'baseSupplyActual', 'baseSupplyExpected', {}, 'baseSupply* must be gte, not eq, because they are calculated imprecisely from quoteSupply')
  assert.eq(quoteSupplyActual, quoteSupplyExpected, 'quoteSupplyActual', 'quoteSupplyExpected', {}, 'quoteSupply* must be eq, not lte, because they are calculated precisely from baseSupply')
  assert.twoBy(isEqualBy(v => v === 0n), 'isEqualBy(eq(zero))')(baseSupplyActual, quoteSupplyActual, 'baseSupplyActual', 'quoteSupplyActual') // isZero(baseSupplyActual) === isZero(quoteSupplyActual)
  return fairpool
}

export const validateFairpoolFull = (quoteBalances: ImBalance[]) => (fairpoolIn: Fairpool) => {
  const fairpool = validateFairpool(fairpoolIn)
  const quoteSupplyActual = fairpool.quoteSupply
  const quoteSupplyTallies = getTotalSupply(fairpool.tallies)
  const quoteAmountContractActual = getAmountD(fairpool.address)(quoteBalances)
  const quoteAmountContractExpected = quoteSupplyActual + quoteSupplyTallies
  assert.eq(quoteAmountContractActual, quoteAmountContractExpected, 'quoteAmountContractActual', 'quoteAmountContractExpected', {}, 'Actual quote amount that is held by the contract should be equal to sum(tallies) + quoteSupply')
  return fairpool
}

export const isFairpool = (value: unknown): value is Fairpool => {
  try {
    validateFairpool(value as Fairpool)
    return true
  } catch {
    return false
  }
}

export const validateFairpools = (quoteBalances: ImBalance[]) => (fairpools: Fairpool[]) => {
  return fairpools.map(validateFairpoolFull(quoteBalances))
}
