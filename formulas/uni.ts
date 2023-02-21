import { clone, createPipe, map, pipe, range } from 'remeda'
import { BalanceGen, BalanceGenTuple } from '../../ethereum/models/BalanceGen'
import { ReckGen, ReckGenTuple } from '../../finance/models/ReckGen'
import { toReckGenTuple } from '../../finance/models/ReckGen/toReckGenTuple'
import { Mutator } from '../../generic/models/Mutator'
import { Arithmetic } from '../../utils/arithmetic'
import { getAssert } from '../../utils/arithmetic/getAssert'
import { getDeltas } from '../../utils/arithmetic/getDeltas'
import { halve as $halve } from '../../utils/arithmetic/halve'
import { sumAmounts } from '../../utils/arithmetic/sum'
import { BigIntArithmetic } from '../../utils/bigint/BigIntArithmetic'
import { inner, input, output } from '../../utils/debug'
import { ensureFind, getFinder } from '../../utils/ensure'
import { AssertionFailedError } from '../../utils/error'
import { isEqualBy } from '../../utils/lodash'
import { get__filename } from '../../utils/node'
import { meldWithLast } from '../../utils/remeda/meldWithLast'
import { toBoundedArray } from './arbitraries/toBoundedArray'
import { toQuotients } from './arbitraries/toQuotients'

export type Address = string

export type Asset = string

export type Amount = bigint

type N = Amount

export type Reck = ReckGen<Address, Asset, Amount>

export type ReckTuple = ReckGenTuple<Address, Asset, Amount>

export type Balance = BalanceGen<Address, Amount>

export type BalanceTuple = BalanceGenTuple<Address, Amount>

interface Fairpool {
  balances: Balance[]
}

export interface State {
  fairpools: Fairpool[]
}

export type Action = Mutator<Reck[]>

export interface BalancesBQ {
  base: Reck
  quote: Reck
}

export interface AmountsBQ {
  base: Amount
  quote: Amount
}

export interface Context extends Params {
  arithmetic: Arithmetic<Amount> // TODO: remove backwards compatibility
  baseAsset: Asset
  quoteAsset: Asset
}

export interface Params {
  baseLimit: Amount,
  quoteOffset: Amount
}

const arithmetic = BigIntArithmetic
const assert = getAssert(arithmetic)
const halve = $halve(arithmetic)
const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic

export class BaseDeltaMustBeGreaterThanZero extends AssertionFailedError<{ baseDelta: Amount }> {}

export class QuoteDeltaMustBeGreaterThanZero extends AssertionFailedError<{ quoteDelta: Amount }> {}

const __filename = get__filename(import.meta.url)

export const toContextFun = <Rest>(f: (baseLimit: N, quoteOffset: N) => Rest) => (context: Context) => f(context.baseLimit, context.quoteOffset)

export const getBaseSupply = (baseLimit: N, quoteOffset: N) => (quoteSupply: N) => {
  const numerator = mul(baseLimit, quoteSupply)
  const denominator = add(quoteOffset, quoteSupply)
  return div(numerator, denominator)
}

export const getQuoteSupply = (baseLimit: N, quoteOffset: N) => (baseSupply: N) => {
  assert.lt(baseSupply, baseLimit, 'baseSupply', 'baseLimit')
  const numerator = mul(quoteOffset, baseSupply)
  const denominator = sub(baseLimit, baseSupply)
  return div(numerator, denominator)
}

export const getQuoteSupplyC = toContextFun(getQuoteSupply)

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

export const getQuoteSupplyMaxC = toContextFun(getQuoteSupplyMax)

export const getQuoteSupplyMaxByDefinition = (baseLimit: N, quoteOffset: N) => {
  return getQuoteSupply(baseLimit, quoteOffset)(sub(one)(baseLimit))
}

export const getQuoteSupplyMaxByDefinitionC = toContextFun(getQuoteSupplyMaxByDefinition)

export const getQuoteSupplyFor = (baseLimit: N, quoteOffset: N) => (baseSupply: N) => {
  const baseSupplyNext = add(one)(baseSupply)
  const quoteSupplyNext = getQuoteSupply(baseLimit, quoteOffset)(baseSupplyNext)
  return sub(one)(quoteSupplyNext)
}

export const getQuoteSupplyForC = toContextFun(getQuoteSupplyFor)

export const getQuoteDeltaMin = (baseLimit: N, quoteOffset: N) => getQuoteSupplyFor(baseLimit, quoteOffset)(arithmetic.one)

export const getQuoteDeltaMinC = toContextFun(getQuoteDeltaMin)

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

export const byAssetWallet = (asset: Asset, wallet: Address) => (balance: Reck) => {
  return balance.asset === asset && balance.wallet === wallet
}

export const getBalancesBQ = (baseAsset: Asset, quoteAsset: Asset) => (wallet: Address) => (balances: Reck[]) => {
  const base = getBalance(baseAsset)(wallet)(balances)
  const quote = getBalance(quoteAsset)(wallet)(balances)
  return { base, quote }
}

export const getAmountsBQ = (baseAsset: Asset, quoteAsset: Asset) => (wallet: Address) => (balances: Reck[]) => {
  const balancesBQ = getBalancesBQ(baseAsset, quoteAsset)(wallet)(balances)
  return { base: balancesBQ.base.amount, quote: balancesBQ.quote.amount }
}

export const getBalance = (asset: Asset) => (wallet: Address) => (balances: Reck[]) => {
  return ensureFind(balances, byAssetWallet(asset, wallet))
}

export const getAmount = (asset: Asset) => (wallet: Address) => (balances: Reck[]) => {
  return getBalance(asset)(wallet)(balances).amount
}

const getBalanceMutators = () => {
  return {
    addB: (delta: N) => (reck: Reck) => { reck.amount = add(reck.amount, delta) },
    subB: (delta: N) => (reck: Reck) => { reck.amount = sub(reck.amount, delta) },
    mulB: (coefficient: N) => (reck: Reck) => { reck.amount = mul(reck.amount, coefficient) },
    divB: (coefficient: N) => (reck: Reck) => { reck.amount = div(reck.amount, coefficient) },
    sendB: (delta: N) => (from: Reck, to: Reck) => {
      from.amount = sub(from.amount, delta)
      to.amount = add(to.amount, delta)
    },
  }
}

export const getTotalSupply = (asset: Asset) => (recks: Reck[]) => sumAmounts(arithmetic)(recks.filter(b => b.asset === asset))

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
 * @deprecated
 */
export const getQuoteSupplyAcceptableMaxC = toContextFun(getQuoteSupplyAcceptableMax)

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

export const getBaseSupplySuperlinearMinC = toContextFun(getBaseSupplySuperlinearMin)

export const getInitialPrice = (baseLimit: N, quoteOffset: N) => div(quoteOffset, baseLimit)

export const getBaseDeltasFromNumerators = (baseLimit: N, quoteOffset: N) => (baseDeltaMin: N, baseSupplyMax: N) => (numerators: number[]) => {
  const toQuotientsLocal = toQuotients(arithmetic)
  const toBoundedArrayLocal = toBoundedArray(arithmetic)(baseDeltaMin, baseSupplyMax)
  return pipe(numerators.map(num), toQuotientsLocal, toBoundedArrayLocal)
}

export const getBaseDeltasFromBaseDeltaNumeratorsSuperlinearSafe = (baseLimit: N, quoteOffset: N) => {
  const baseSupplySuperlinearMin = getBaseSupplySuperlinearMin(baseLimit, quoteOffset)
  const baseDeltaMin = max(one, baseSupplySuperlinearMin) // yes, max(), because baseDeltaMin must be gte one and gte baseSupplySuperlinearMin, but baseSupplySuperlinearMin may be eq zero
  const baseSupplyMax = halve(baseLimit)
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

export const getQuoteDeltasFromBaseDeltasC = toContextFun(getQuoteDeltasFromBaseDeltas)

export const getQuoteDeltasFromBaseDeltaNumeratorsSuperlinearSafe = (baseLimit: N, quoteOffset: N) => createPipe(
  getBaseDeltasFromBaseDeltaNumeratorsSuperlinearSafe(baseLimit, quoteOffset),
  getQuoteDeltasFromBaseDeltas(baseLimit, quoteOffset)
)

export const getQuoteDeltasFromBaseDeltaNumeratorsFullRange = (baseLimit: N, quoteOffset: N) => createPipe(
  getBaseDeltasFromBaseDeltaNumeratorsFullRange(baseLimit, quoteOffset),
  getQuoteDeltasFromBaseDeltas(baseLimit, quoteOffset)
)

export const getQuoteDeltasFromBaseDeltaNumeratorsFullRangeC = toContextFun(getQuoteDeltasFromBaseDeltaNumeratorsFullRange)

/**
 * Currently this function is called in every action. This is suboptimal, must be refactored (requires moving baseLimit and quoteOffset to State)
 */
export const validateContext = (context: Context) => {
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = context
  const quoteOffsetCalculated = pipe(quoteOffset, div(baseLimit), mul(baseLimit))
  assert.gt(baseLimit, zero, 'baseLimit', 'zero')
  assert.gt(quoteOffset, zero, 'quoteOffset', 'zero')
  assert.lt(baseLimit, quoteOffset, 'baseLimit', 'quoteOffset', 'Required for lt(baseDelta, quoteDelta)')
  assert.eq(quoteOffsetCalculated, quoteOffset, 'quoteOffsetCalculated', 'quoteOffset', 'Required for quoteOffset = k * baseLimit')
  return context
}

export const validateBalances = (context: Context) => (contract: Address) => (balances: Reck[]) => {
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = context
  const baseSupplyActual = getTotalSupply(baseAsset)(balances)
  const quoteSupplyActual = getAmount(quoteAsset)(contract)(balances)
  const baseSupplyExpected = getBaseSupply(baseLimit, quoteOffset)(quoteSupplyActual)
  const quoteSupplyExpected = getQuoteSupply(baseLimit, quoteOffset)(baseSupplyActual)
  // inter(__filename, validateBalances, { baseSupplyActual, baseSupplyExpected })
  // inter(__filename, validateBalances, { quoteSupplyActual, quoteSupplyExpected })
  assert.gte(baseSupplyActual, baseSupplyExpected, 'baseSupplyActual', 'baseSupplyExpected', 'baseSupply* must be gte, not eq, because they are calculated imprecisely from quoteSupply')
  assert.eq(quoteSupplyActual, quoteSupplyExpected, 'quoteSupplyActual', 'quoteSupplyExpected', 'quoteSupply* must be eq, not lte, because they are calculated precisely from baseSupply')
  assert.by(isEqualBy(eq(zero)), 'isEqualBy(eq(zero))')(baseSupplyActual, quoteSupplyActual, 'baseSupplyActual', 'quoteSupplyActual') // isZero(baseSupplyActual) === isZero(quoteSupplyActual)
  return balances
}

export const buy = (context: Context) => (contract: Address, sender: Address, quoteDeltaProposed: N) => ($balances: Reck[]) => {
  input(__filename, buy, { action: 'buy', contract, sender, quoteDeltaProposed })
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = validateContext(context)
  const { addB, subB, mulB, divB, sendB } = getBalanceMutators()
  const balances = clone($balances)
  const getBalancesLocal = getBalancesBQ(baseAsset, quoteAsset)
  const balancesContract = getBalancesLocal(contract)(balances)
  const balancesSender = getBalancesLocal(sender)(balances)
  const baseSupplyCurrent = getTotalSupply(baseAsset)(balances)
  const quoteSupplyCurrent = balancesContract.quote.amount
  const { baseDelta, quoteDelta } = getBuyDeltas(baseLimit, quoteOffset)(baseSupplyCurrent, quoteSupplyCurrent)(quoteDeltaProposed)
  sendB(quoteDelta)(balancesSender.quote, balancesContract.quote)
  addB(baseDelta)(balancesSender.base)
  return validateBalances(context)(contract)(balances)
}

export const sell = (context: Context) => (contract: Address, sender: Address, baseDeltaProposed: N) => ($balances: Reck[]) => {
  input(__filename, sell, { action: 'sell', contract, sender, baseDeltaProposed })
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = validateContext(context)
  const { addB, subB, mulB, divB, sendB } = getBalanceMutators()
  const balances = clone($balances)
  const getBalancesLocal = getBalancesBQ(baseAsset, quoteAsset)
  const balancesContract = getBalancesLocal(contract)(balances)
  const balancesSender = getBalancesLocal(sender)(balances)
  const baseSupplyCurrent = getTotalSupply(baseAsset)(balances)
  const quoteSupplyCurrent = balancesContract.quote.amount
  const { baseDelta, quoteDelta } = getSellDeltas(baseLimit, quoteOffset)(baseSupplyCurrent, quoteSupplyCurrent)(baseDeltaProposed)
  sendB(quoteDelta)(balancesContract.quote, balancesSender.quote)
  subB(baseDelta)(balancesSender.base)
  return validateBalances(context)(contract)(balances)
}

export const selloff = (context: Context) => (contract: Address, sender: Address) => ($balances: Reck[]) => {
  const { baseAsset, quoteAsset } = validateContext(context)
  const baseDelta = getBalancesBQ(baseAsset, quoteAsset)(sender)($balances).base.amount
  // const amountQuoteSender = getAmount(balances)(quoteAsset)(sender)
  return sell(context)(contract, sender, baseDelta)($balances)
}

export const getBalanceRendered = (balance: Reck) => toReckGenTuple(balance).map(v => v.toString())

export const getBalancesRendered = map(getBalanceRendered)

export const getBalancesEvolution = (asset: string, sender: string) => (balancesEvolution: Reck[][]) => balancesEvolution.map(getFinder(byAssetWallet(asset, sender)))

export const getStats = (context: Context) => (scale: N) => (start: number, end: number, multiplier: number) => {
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = context
  const upscale = mul(scale)
  const baseLimitScaled = upscale(baseLimit)
  const quoteOffsetScaled = upscale(quoteOffset)
  const quoteSupplyAcceptableMax = getQuoteSupplyAcceptableMax(baseLimitScaled, quoteOffsetScaled)
  return range(start, end).map(n => {
    const quoteSupply = upscale(num(n * multiplier))
    const baseSupplyCalc = getBaseSupply(baseLimitScaled, quoteOffsetScaled)(quoteSupply)
    const quoteSupplyCalc = getQuoteSupply(baseLimitScaled, quoteOffsetScaled)(baseSupplyCalc)
    const diff = sub(quoteSupply, quoteSupplyCalc)
    const isOptimal = diff === 0n && quoteSupply !== 0n
    const isAcceptableMax = eq(quoteSupply, quoteSupplyAcceptableMax)
    return { baseSupplyCalc, quoteSupply, quoteSupplyCalc, diff, isOptimal, isAcceptableMax }
  })
}

export const getPrices = (baseLimit: N, quoteOffset: N) => (quoteSupplyFrom$: number, quoteSupplyTo$: number) => {
  const quoteSupplyArr = range(quoteSupplyFrom$, quoteSupplyTo$).map(arithmetic.num)
  const baseSupplyArr = quoteSupplyArr.map(getBaseSupply(baseLimit, quoteOffset))
  return getDeltas(arithmetic)(baseSupplyArr)
}

export const getPricesC = toContextFun(getPrices)
