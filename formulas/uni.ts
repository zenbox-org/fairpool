import { createPipe, map, pick, pipe } from 'remeda'
import { asSafeMutator } from '../../divide-and-conquer/asSafeMutator'
import { BalanceGen, BalanceGenTuple } from '../../finance/models/BalanceGen'
import { FintGen, FintGenTuple } from '../../finance/models/FintGen'
import { getGenMutilatorsWithAmount } from '../../finance/models/FintGen/getGenMutilatorsWithAmount'
import { toFintGenTuple } from '../../finance/models/FintGen/toFintGenTuple'
import { Mutator } from '../../generic/models/Mutator'
import { Arithmetic } from '../../utils/arithmetic'
import { getAssert } from '../../utils/arithmetic/getAssert'
import { halve as $halve } from '../../utils/arithmetic/halve'
import { BigIntArithmetic } from '../../utils/bigint/BigIntArithmetic'
import { inner, input, output } from '../../utils/debug'
import { ensureByIndex, ensureFind, getFinder } from '../../utils/ensure'
import { AssertionFailedError } from '../../utils/error'
import { get__filename } from '../../utils/node'
import { meldWithLast } from '../../utils/remeda/meldWithLast'
import { toBoundedArray } from './arbitraries/toBoundedArray'
import { toQuotients } from './arbitraries/toQuotients'
import { getAmount, getBalanceD, getTotalSupply, grabBalance } from './helpers'
import { validateFairpools } from './validators/validateFairpool'

type N = bigint

export type Address = string

export type Asset = string

export type Amount = bigint

export type Fint = FintGen<Address, Asset, Amount>

export type FintTuple = FintGenTuple<Address, Asset, Amount>

export type Balance = BalanceGen<Address, Amount>

export type BalanceTuple = BalanceGenTuple<Address, Amount>

export type History<T> = T[]

export interface Beneficiary {
  address: Address
  share: N
}

export interface PrePriceParams {
  baseLimit: N
  quoteOffsetMultiplierProposed: N
}

export interface PriceParams {
  baseLimit: Amount,
  quoteOffset: Amount
}

export interface DistributionParams {
  royalties: N
  earnings: N
  fees: N
}

export interface Fairpool extends PriceParams, DistributionParams {
  address: Address
  balances: Balance[] // in base currency // TODO: Validate that balance addresses are unique
  tallies: Balance[] // in quote currency
  quoteSupply: Amount
  scale: N
  beneficiaries: Beneficiary[]
  owner: Address
  operator: Address
  holdersPerDistributionMax: N
}

export interface Blockchain {
  balances: Balance[]
}

export interface State {
  blockchain: Blockchain
  fairpools: Fairpool[]
}

export type Action = Mutator<State>

export interface BalancesBQ {
  base: Fint
  quote: Fint
}

export interface AmountsBQ {
  base: Amount
  quote: Amount
}

export interface Context extends PriceParams {
  arithmetic: Arithmetic<Amount> // TODO: remove backwards compatibility
  baseAsset: Asset
  quoteAsset: Asset
}

const arithmetic = BigIntArithmetic
const assert = getAssert(arithmetic)
const halve = $halve(arithmetic)
const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
const { addB, subB, mulB, divB, sendB } = getGenMutilatorsWithAmount(arithmetic)

export class BaseDeltaMustBeGreaterThanZero extends AssertionFailedError<{ baseDelta: Amount }> {}

export class QuoteDeltaMustBeGreaterThanZero extends AssertionFailedError<{ quoteDelta: Amount }> {}

const __filename = get__filename(import.meta.url)

export const getFairpoolFun = <Rest>(f: (baseLimit: N, quoteOffset: N) => Rest) => (fairpool: Fairpool) => f(fairpool.baseLimit, fairpool.quoteOffset)

export const getBaseSupply = (baseLimit: N, quoteOffset: N) => (quoteSupply: N) => {
  const numerator = mul(baseLimit, quoteSupply)
  const denominator = add(quoteOffset, quoteSupply)
  const baseSupply = div(numerator, denominator)
  assert.lt(baseSupply, baseLimit, 'baseSupply', 'baseLimit')
  return baseSupply
}

export const getBaseSupplyF = getFairpoolFun(getBaseSupply)

export const getQuoteSupply = (baseLimit: N, quoteOffset: N) => (baseSupply: N) => {
  assert.lt(baseSupply, baseLimit, 'baseSupply', 'baseLimit')
  const numerator = mul(quoteOffset, baseSupply)
  const denominator = sub(baseLimit, baseSupply)
  return div(numerator, denominator)
}

export const getQuoteSupplyF = getFairpoolFun(getQuoteSupply)

/**
 * For illustration purposes only
 * This is a special formula that works only for "derived quoteSupply"
 * "derived quoteSupply" is quoteSupply that was returned from a call to getQuoteSupply
 */
export const getBaseSupplyForDerivedQuoteSupply = (baseLimit: N, quoteOffset: N) => (quoteSupply: N) => {
  if (quoteSupply == 0n) return 0n
  const quoteSupplyNext = quoteSupply + 1n // derived quoteSupply is at least 1n less than quoteSupply that will result in a symmetric baseSupply
  const numerator = mul(baseLimit, quoteSupplyNext)
  const denominator = add(quoteOffset, quoteSupplyNext)
  const baseSupply = div(numerator, denominator)
  assert.lt(baseSupply, baseLimit, 'baseSupply', 'baseLimit')
  return baseSupply
}

export const getBaseDelta = (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (quoteDeltaProposed: N) => {
  const quoteSupplyNew = add(quoteSupplyCurrent, quoteDeltaProposed)
  const baseSupplyNew = getBaseSupply(baseLimit, quoteOffset)(quoteSupplyNew)
  return sub(baseSupplyNew, baseSupplyCurrent)
}

export const getQuoteDelta = (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (baseDeltaProposed: N) => {
  const baseSupplyNew = sub(baseSupplyCurrent, baseDeltaProposed)
  const quoteSupplyNew = getQuoteSupply(baseLimit, quoteOffset)(baseSupplyNew)
  return sub(quoteSupplyCurrent, quoteSupplyNew)
}

/**
 * quoteSupplyMax == quoteOffset * (baseLimit - 1)
 */
export const getQuoteSupplyMax = (baseLimit: N, quoteOffset: N) => {
  return mul(quoteOffset, sub(baseLimit, one))
}

export const getQuoteSupplyMaxF = getFairpoolFun(getQuoteSupplyMax)

export const getQuoteSupplyMaxByDefinition = (baseLimit: N, quoteOffset: N) => {
  return getQuoteSupply(baseLimit, quoteOffset)(sub(one)(baseLimit))
}

export const getQuoteSupplyMaxByDefinitionF = getFairpoolFun(getQuoteSupplyMaxByDefinition)

export const getQuoteSupplyFor = (baseLimit: N, quoteOffset: N) => (baseSupply: N) => {
  const toQuoteSupply = getQuoteSupply(baseLimit, quoteOffset)
  const toBaseLimit = getBaseSupply(baseLimit, quoteOffset)
  const quoteSupply = toQuoteSupply(baseSupply)
  if (toBaseLimit(quoteSupply) === baseSupply) {
    return quoteSupply
  } else {
    return quoteSupply + 1n
  }
}

export const getQuoteSupplyForF = getFairpoolFun(getQuoteSupplyFor)

export const getQuoteDeltaMin = (baseLimit: N, quoteOffset: N) => getQuoteSupplyFor(baseLimit, quoteOffset)(arithmetic.one)

export const getQuoteDeltaMinF = getFairpoolFun(getQuoteDeltaMin)

// /**
//  * TODO: Rewrite to (quoteDeltaDefault: N) => (quoteDeltaMultipliers: N[])
//  */
// export const getQuoteDeltaNext = (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (quoteDeltaPrev: N) => {
//   const { add, sub, mul, div, one } = arithmetic
//   const deltas = getBuyDeltas(baseLimit, quoteOffset)(baseSupplyCurrent, quoteSupplyCurrent)(quoteDeltaPrev)
//   const baseSupplyNew = add(deltas.baseDelta)(baseSupplyCurrent)
//   const quoteSupplyNew = add(deltas.quoteDelta)(quoteSupplyCurrent)
//   return getQuoteDeltaMin(baseLimit, quoteOffset)(baseSupplyNew, quoteSupplyNew)
// }

/**
 * NOTE: actual deltas are always less than or equal to expected deltas (because of integer division)
 */
export const getBuyDeltas = (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (quoteDeltaProposed: N) => {
  input(__filename, getBuyDeltas, { baseSupplyCurrent, quoteSupplyCurrent, quoteDeltaProposed })
  assert.gte(quoteDeltaProposed, zero, 'quoteDeltaProposed', 'zero')
  const quoteSupplyProposed = add(quoteSupplyCurrent, quoteDeltaProposed)
  const baseSupplyNew = getBaseSupply(baseLimit, quoteOffset)(quoteSupplyProposed)
  const quoteSupplyNew = getQuoteSupply(baseLimit, quoteOffset)(baseSupplyNew)
  assert.lte(quoteSupplyNew, quoteSupplyProposed, 'quoteSupplyNew', 'quoteSupplyProposed')
  const baseDelta = sub(baseSupplyNew, baseSupplyCurrent)
  const quoteDelta = sub(quoteSupplyNew, quoteSupplyCurrent)
  // inter(__filename, getBuyDeltas, { baseDelta, quoteDelta })
  if (!gt(zero)(baseDelta)) throw new BaseDeltaMustBeGreaterThanZero({ baseDelta })
  if (!gt(zero)(quoteDelta)) throw new QuoteDeltaMustBeGreaterThanZero({ quoteDelta })
  return output(__filename, getBuyDeltas, { baseDelta, quoteDelta })
}

/**
 * NOTE: actual deltas are always less than or equal to expected deltas (because of integer division)
 * NOTE: sell deltas are positive, but they should be subtracted from the current balances (not added)
 */
export const getSellDeltas = (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (baseDeltaProposed: N) => {
  input(__filename, getSellDeltas, { baseSupplyCurrent, quoteSupplyCurrent, baseDeltaProposed })
  const baseSupplyProposed = sub(baseSupplyCurrent, baseDeltaProposed)
  const quoteSupplyProposed = getQuoteSupply(baseLimit, quoteOffset)(baseSupplyProposed)
  const baseDelta = sub(baseSupplyCurrent, baseSupplyProposed)
  const quoteDelta = sub(quoteSupplyCurrent, quoteSupplyProposed)
  inner(__filename, getSellDeltas, { baseDelta, quoteDelta })
  if (!gt(zero)(baseDelta)) throw new BaseDeltaMustBeGreaterThanZero({ baseDelta })
  if (!gt(zero)(quoteDelta)) throw new QuoteDeltaMustBeGreaterThanZero({ quoteDelta })
  return output(__filename, getSellDeltas, { baseDelta, quoteDelta })
}

export const byAssetWallet = (asset: Asset, wallet: Address) => (balance: Fint) => {
  return balance.asset === asset && balance.wallet === wallet
}

// export const getTotalSupplyR = (asset: Asset) => (recks: Fint[]) => getTotalSupply(recks.filter(b => b.asset === asset))

/**
 * @deprecated
 */
export const getQuoteSupplyAcceptableMax = (baseLimit: N, quoteOffset: N) => {
  const two = add(one, one)
  const four = add(two, two)
  // 1/2 * (sqrt(4 * l * o + 1) - 2 * o - 1)
  return div(two)(sub(
    sqrt(add(mul(four)(mul(baseLimit)(quoteOffset)), one)),
    sub(mul(two)(quoteOffset), one)
  ))
}

/**
 * initialPrice = quoteOffset / baseLimit
 * baseSupplySuperlinearMin = baseLimit / (initialPrice + 1)
 * NOTE: baseSupplySuperlinearMin can be zero
 *
 * if (baseSupply < baseSupplySuperlinearMin) quoteSupply == initialPrice * baseSupply
 * if (baseSupply == baseSupplySuperlinearMin) quoteSupply >= initialPrice * baseSupply
 * if (baseSupply > baseSupplySuperlinearMin) quoteSupply > initialPrice * baseSupply
 */
export const getBaseSupplySuperlinearMin = (baseLimit: N, quoteOffset: N) => {
  const initialPrice = getInitialPrice(baseLimit, quoteOffset)
  const denominator = add(initialPrice, one)
  return div(baseLimit, denominator)
}

export const getBaseSupplySuperlinearMinF = getFairpoolFun(getBaseSupplySuperlinearMin)

export const getInitialPrice = (baseLimit: N, quoteOffset: N) => div(quoteOffset, baseLimit)

export const getBaseDeltasFromNumerators = (baseLimit: N, quoteOffset: N) => (baseDeltaMin: N, baseSupplyMax: N) => (numerators: number[]) => {
  const toQuotientsLocal = toQuotients(arithmetic)
  const toBoundedArrayLocal = toBoundedArray(arithmetic)(baseDeltaMin, baseSupplyMax)
  return pipe(numerators.map(num), toQuotientsLocal, toBoundedArrayLocal)
}

export const getBaseDeltasFromBaseDeltaNumeratorsSuperlinearSafe = (baseLimit: N, quoteOffset: N) => {
  const baseSupplySuperlinearMin = getBaseSupplySuperlinearMin(baseLimit, quoteOffset)
  const baseDeltaMin = max(one, baseSupplySuperlinearMin) // yes, max(), because baseDeltaMin must be gte one and gte baseSupplySuperlinearMin, but baseSupplySuperlinearMin may be eq zero
  const baseSupplyMax = sub(one)(baseLimit)
  return getBaseDeltasFromNumerators(baseLimit, quoteOffset)(baseDeltaMin, baseSupplyMax)
}

export const getBaseDeltasFromBaseDeltaNumeratorsFullRange = (baseLimit: N, quoteOffset: N) => {
  const baseSupplyMax = pipe(baseLimit, sub(one), sub(one)) // subtract twice because getQuoteSupplyFor does add(one)(baseSupply)
  return getBaseDeltasFromNumerators(baseLimit, quoteOffset)(one, baseSupplyMax)
}

export const getBaseSuppliesFromBaseDeltas = meldWithLast(add, zero)

export const getQuoteDeltasFromBaseDeltas = (baseLimit: N, quoteOffset: N) => (baseDeltas: N[]) => {
  const baseSupplies = getBaseSuppliesFromBaseDeltas(baseDeltas)
  return baseSupplies.map(getQuoteSupplyFor(baseLimit, quoteOffset))
}

export const getQuoteDeltasFromBaseDeltasF = getFairpoolFun(getQuoteDeltasFromBaseDeltas)

export const getQuoteDeltasFromBaseDeltaNumeratorsSuperlinearSafe = (baseLimit: N, quoteOffset: N) => createPipe(
  getBaseDeltasFromBaseDeltaNumeratorsSuperlinearSafe(baseLimit, quoteOffset),
  getQuoteDeltasFromBaseDeltas(baseLimit, quoteOffset)
)

export const getQuoteDeltasFromBaseDeltaNumeratorsFullRange = (baseLimit: N, quoteOffset: N) => createPipe(
  getBaseDeltasFromBaseDeltaNumeratorsFullRange(baseLimit, quoteOffset),
  getQuoteDeltasFromBaseDeltas(baseLimit, quoteOffset)
)

export const getQuoteDeltasFromBaseDeltaNumeratorsFullRangeF = getFairpoolFun(getQuoteDeltasFromBaseDeltaNumeratorsFullRange)

export const validateState = (state: State): State => {
  const { fairpools, blockchain } = state
  return {
    fairpools: validateFairpools(blockchain.balances)(fairpools),
    blockchain: validateBlockchain(blockchain),
  }
}

export const validateBlockchain = (blockchain: Blockchain) => {
  const { balances } = blockchain
  return {
    balances /* Not throwing errors for negative balances because otherwise it would be very difficult to generate arbitrary values in tests */,
  }
}

export const getStateLocal = (contract: Address) => ({ blockchain, fairpools }: State) => ({
  fairpool: ensureFind(fairpools, f => f.address === contract),
  blockchain,
})

// export const getBalancesLocal = (contract: Address, sender: Address) => (fairpool: Fairpool, blockchain: Blockchain) => {
//   return {
//     [contract]: {
//       base: getBalance(contract)(fairpool.balances),
//       quote: getBalance(contract)(blockchain.balances),
//     },
//     [sender]: {
//       base: getBalance(sender)(fairpool.balances),
//       quote: getBalance(sender)(blockchain.balances),
//     },
//   }
// }

export const getBalancesLocalD = (addresses: Address[]) => (fairpool: Fairpool, blockchain: Blockchain) => {
  return Object.fromEntries<{ base: Balance, quote: Balance }>(addresses.map(address => [address, {
    base: getBalanceD(address)(fairpool.balances),
    quote: getBalanceD(address)(blockchain.balances),
  }]))
}

export const buy = (contract: Address, sender: Address, quoteDeltaProposed: Amount) => asSafeMutator((state: State) => {
  input(__filename, buy, { action: 'buy', contract, sender, quoteDeltaProposed })
  const { fairpool, blockchain } = getStateLocal(contract)(state)
  const { baseLimit, quoteOffset } = fairpool
  // const balancesContract = getBalancesLocal(contract)(balances)
  // const balancesSender = getBalancesLocal(sender)(balances)
  const baseSupplyCurrent = getTotalSupply(fairpool.balances)
  const quoteSupplyCurrent = fairpool.quoteSupply
  const { baseDelta, quoteDelta } = getBuyDeltas(baseLimit, quoteOffset)(baseSupplyCurrent, quoteSupplyCurrent)(quoteDeltaProposed)
  const balanceSenderBase = grabBalance(sender)(fairpool.balances)
  const balanceSenderQuote = grabBalance(sender)(blockchain.balances)
  const balanceContractQuote = grabBalance(contract)(blockchain.balances)
  fairpool.quoteSupply += quoteDelta
  sendB(quoteDelta)(balanceSenderQuote, balanceContractQuote)
  addB(baseDelta)(balanceSenderBase)
  return validateState(state)
})

export const sell = (contract: Address, sender: Address, baseDeltaProposed: N) => asSafeMutator((state: State) => {
  input(__filename, sell, { action: 'sell', contract, sender, baseDeltaProposed })
  const { fairpool, blockchain } = getStateLocal(contract)(state)
  const { baseLimit, quoteOffset } = fairpool
  const baseSupplyCurrent = getTotalSupply(fairpool.balances)
  const quoteSupplyCurrent = fairpool.quoteSupply
  const { baseDelta, quoteDelta } = getSellDeltas(baseLimit, quoteOffset)(baseSupplyCurrent, quoteSupplyCurrent)(baseDeltaProposed)
  const balanceSenderBase = grabBalance(sender)(fairpool.balances)
  const balanceSenderQuote = grabBalance(sender)(blockchain.balances)
  const balanceContractQuote = grabBalance(contract)(blockchain.balances)
  fairpool.quoteSupply -= quoteDelta
  sendB(quoteDelta)(balanceContractQuote, balanceSenderQuote)
  subB(baseDelta)(balanceSenderBase)
  return validateState(state)
})

export const selloff = (contract: Address, sender: Address) => asSafeMutator((state: State) => {
  const { fairpool, blockchain } = getStateLocal(contract)(state)
  const baseDelta = getAmount(sender)(fairpool.balances)
  return sell(contract, sender, baseDelta)(state)
})

export const getFairpoolAt = (index: number) => (state: State) => ensureByIndex(state.fairpools, index)

export const getFairpool = getFairpoolAt(0)

export const getFairpoolQuoteOffset = (state: State) => getFairpool(state).quoteOffset

export const getBalancesBase = (state: State, index = 0) => ensureByIndex(state.fairpools, index).balances

export const getBalancesQuote = (state: State) => state.blockchain.balances

export const getFintRendered = (fint: Fint) => toFintGenTuple(fint).map(v => v.toString())

export const getFintsRendered = map(getFintRendered)

export const getFintsHistory = (asset: string, sender: string) => (history: History<Fint[]>) => history.map(getFinder(byAssetWallet(asset, sender)))

export const getPricingParamsFromFairpool = pick<Fairpool, keyof Fairpool>(['baseLimit', 'quoteOffset'])
