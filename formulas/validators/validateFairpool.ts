import { assert } from '../../../utils/bigint/arithmetic'
import { isEqualBy } from '../../../utils/lodash'
import { getAmountD, getTotalSupply } from '../helpers'
import { Balance, Fairpool, getBaseSupplyF, getQuoteSupplyF } from '../uni'
import { validateBalances } from './validateBalance'
import { validatePricingParams } from './validatePricingParams'
import { validateShares } from './validateShares'

export const validateFairpool = (quoteBalances: Balance[]) => <T extends Fairpool>(fairpoolIn: T) => {
  const fairpool = validatePricingParams(fairpoolIn)
  validateBalances(fairpool.balances)
  validateBalances(fairpool.tallies)
  validateShares(fairpool.scale)(fairpool.shares)
  assert.lte(fairpool.holdersPerDistributionMax, BigInt(Number.MAX_SAFE_INTEGER), 'fairpool.holdersPerDistributionMax', 'BigInt(Number.MAX_SAFE_INTEGER)', {}, 'Required for range() in getTalliesDelta()')
  const quoteSupplyTallies = getTotalSupply(fairpool.tallies)
  const baseSupplyActual = getTotalSupply(fairpool.balances)
  const quoteSupplyActual = fairpool.quoteSupply
  const quoteAmountContractActual = getAmountD(fairpool.address)(quoteBalances)
  const baseSupplyExpected = getBaseSupplyF(fairpool)(quoteSupplyActual)
  const quoteSupplyExpected = getQuoteSupplyF(fairpool)(baseSupplyActual)
  const quoteAmountContractExpected = quoteSupplyActual + quoteSupplyTallies
  // inter(__filename, validateBalances, { baseSupplyActual, baseSupplyExpected })
  // inter(__filename, validateBalances, { quoteSupplyActual, quoteSupplyExpected })
  assert.eq(quoteAmountContractActual, quoteAmountContractExpected, 'quoteAmountContractActual', 'quoteAmountContractExpected', {}, 'Actual quote amount that is held by the contract should be equal to sum(tallies) + quoteSupply')
  assert.gte(baseSupplyActual, baseSupplyExpected, 'baseSupplyActual', 'baseSupplyExpected', {}, 'baseSupply* must be gte, not eq, because they are calculated imprecisely from quoteSupply')
  assert.eq(quoteSupplyActual, quoteSupplyExpected, 'quoteSupplyActual', 'quoteSupplyExpected', {}, 'quoteSupply* must be eq, not lte, because they are calculated precisely from baseSupply')
  assert.twoBy(isEqualBy(v => v === 0n), 'isEqualBy(eq(zero))')(baseSupplyActual, quoteSupplyActual, 'baseSupplyActual', 'quoteSupplyActual') // isZero(baseSupplyActual) === isZero(quoteSupplyActual)
  return fairpool
}

export const validateFairpools = (quoteBalances: Balance[]) => (fairpools: Fairpool[]) => {
  return fairpools.map(validateFairpool(quoteBalances))
}
