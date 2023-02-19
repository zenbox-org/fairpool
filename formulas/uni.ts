import { clone, map, pipe, range } from 'remeda'
import { Address } from '../../ethereum/models/Address'
import { BalanceGen, BalanceGenTuple } from '../../finance/models/BalanceGen'
import { toBalanceGenTuple } from '../../finance/models/BalanceGen/toBalanceGenTuple'
import { Mutator } from '../../generic/models/Mutator'
import { Arithmetic } from '../../utils/arithmetic'
import { getAssert } from '../../utils/arithmetic/getAssert'
import { sumAmounts } from '../../utils/arithmetic/sum'
import { assertBy } from '../../utils/assert'
import { input, inter } from '../../utils/debug'
import { ensureFind, getFinder } from '../../utils/ensure'
import { AssertionFailedError } from '../../utils/error'
import { isEqualBy } from '../../utils/lodash'
import { get__filename } from '../../utils/node'
import { meldWithLast } from '../../utils/remeda/meldWithLast'
import { WithToString } from '../../utils/string'

export type Wallet = string

export type Asset = string

export type Balance<Amount> = BalanceGen<Wallet, Asset, Amount>

export type BalanceTuple<Amount> = BalanceGenTuple<Wallet, Asset, Amount>

export type Action<N> = Mutator<Balance<N>[]>

export interface BalancesBQ<Amount> {
  base: Balance<Amount>
  quote: Balance<Amount>
}

export interface AmountsBQ<Amount> {
  base: Amount
  quote: Amount
}

export interface Context<N> extends Params<N> {
  arithmetic: Arithmetic<N>
  baseAsset: Asset
  quoteAsset: Asset
}

export interface Params<N> {
  baseLimit: N,
  quoteOffset: N
}

export class BaseDeltaMustBeGreaterThanZero<N> extends AssertionFailedError<{ baseDelta: N }> {}

export class QuoteDeltaMustBeGreaterThanZero<N> extends AssertionFailedError<{ quoteDelta: N }> {}

const __filename = get__filename(import.meta.url)

export const toContextFun = <N, Rest>(f: (arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => Rest) => (context: Context<N>) => f(context.arithmetic)(context.baseLimit, context.quoteOffset)

export const getBaseSupply = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (quoteSupply: N) => {
  const { add, sub, mul, div } = arithmetic
  const numerator = mul(baseLimit, quoteSupply)
  const denominator = add(quoteOffset, quoteSupply)
  return div(numerator, denominator)
}

export const getQuoteSupply = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (baseSupply: N) => {
  const { add, sub, mul, div, eq } = arithmetic
  const assert = getAssert(arithmetic)
  assert.lt(baseSupply, baseLimit, 'baseSupply', 'baseLimit')
  const numerator = mul(quoteOffset, baseSupply)
  if (eq(baseLimit, baseSupply)) {
    console.log('baseLimit', 'baseSupply', baseLimit, baseSupply)
    debugger

    throw new Error('Division by zero')
  }
  const denominator = sub(baseLimit, baseSupply)
  return div(numerator, denominator)
}

export const getQuoteSupplyC = toContextFun(getQuoteSupply)

export const getBaseDelta = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (quoteDeltaProposed: N) => {
  const { add, sub, mul, div, gt, lte } = arithmetic
  const quoteSupplyNew = add(quoteSupplyCurrent, quoteDeltaProposed)
  const baseSupplyNew = getBaseSupply(arithmetic)(baseLimit, quoteOffset)(quoteSupplyNew)
  return sub(baseSupplyNew, baseSupplyCurrent)
}

export const getQuoteDelta = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (baseDeltaProposed: N) => {
  const { add, sub, mul, div } = arithmetic
  const baseSupplyNew = sub(baseSupplyCurrent, baseDeltaProposed)
  const quoteSupplyNew = getQuoteSupply(arithmetic)(baseLimit, quoteOffset)(baseSupplyNew)
  return sub(quoteSupplyCurrent, quoteSupplyNew)
}

/**
 * inclusive
 */
export const getQuoteSupplyMax = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => {
  const { add, sub, mul, div, one } = arithmetic
  return getQuoteSupply(arithmetic)(baseLimit, quoteOffset)(sub(one)(baseLimit))
}

export const getQuoteSupplyFor = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (baseSupply: N) => {
  const { add, sub, mul, div, one } = arithmetic
  const baseSupplyNext = add(one)(baseSupply)
  const quoteSupplyNext = getQuoteSupply(arithmetic)(baseLimit, quoteOffset)(baseSupplyNext)
  return sub(one)(quoteSupplyNext)
}

export const getQuoteSupplyForC = toContextFun(getQuoteSupplyFor)

/**
 * @deprecated
 */
export const getQuoteDeltaMin = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => {
  const { add, sub, mul, div, one } = arithmetic
  const quoteSupplyNew = getQuoteSupply(arithmetic)(baseLimit, quoteOffset)(add(one)(baseSupplyCurrent))
  return add(one)(sub(quoteSupplyNew, quoteSupplyCurrent))
}

/**
 * @deprecated
 */
export const getQuoteDeltaMinC = toContextFun(getQuoteDeltaMin)

/**
 * TODO: Rewrite to (quoteDeltaDefault: N) => (quoteDeltaMultipliers: N[])
 */
export const getQuoteDeltaNext = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (quoteDeltaPrev: N) => {
  const { add, sub, mul, div, one } = arithmetic
  const deltas = getBuyDeltas(arithmetic)(baseLimit, quoteOffset)(baseSupplyCurrent, quoteSupplyCurrent)(quoteDeltaPrev)
  const baseSupplyNew = add(deltas.baseDelta)(baseSupplyCurrent)
  const quoteSupplyNew = add(deltas.quoteDelta)(quoteSupplyCurrent)
  return getQuoteDeltaMin(arithmetic)(baseLimit, quoteOffset)(baseSupplyNew, quoteSupplyNew)
}

/**
 * NOTE: actual deltas are always less than or equal to expected deltas (because of integer division)
 */
export const getBuyDeltas = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (quoteDeltaProposed: N) => {
  input(__filename, getBuyDeltas, { baseSupplyCurrent, quoteSupplyCurrent, quoteDeltaProposed })
  const { zero, one, num, add, sub, mul, div, min, max, abs, eq, lt, gt, lte, gte } = arithmetic
  const quoteSupplyProposed = add(quoteSupplyCurrent, quoteDeltaProposed)
  const baseSupplyNew = getBaseSupply(arithmetic)(baseLimit, quoteOffset)(quoteSupplyProposed)
  const quoteSupplyNew = getQuoteSupply(arithmetic)(baseLimit, quoteOffset)(baseSupplyNew)
  inter(__filename, getBuyDeltas, { quoteSupplyProposed, baseSupplyProposed: baseSupplyNew, quoteSupplyNew })
  // const baseSupplyNew = getBaseSupply(arithmetic)(baseLimit, quoteOffset)(quoteSupplyNew)
  // dbg(__filename, getBuyDeltas, { baseSupplyProposed, quoteSupplyProposed, baseSupplyNew, quoteSupplyNew })
  assertBy(lte)(quoteSupplyNew, quoteSupplyProposed, 'quoteSupplyNew', 'quoteSupplyProposed')
  // assertBy(lte)(baseSupplyNew, baseSupplyProposed, 'baseSupplyNew', 'baseSupplyProposed')
  const baseDelta = sub(baseSupplyNew, baseSupplyCurrent)
  const quoteDelta = sub(quoteSupplyNew, quoteSupplyCurrent)
  inter(__filename, getBuyDeltas, { baseDelta, quoteDelta })
  if (!gt(zero)(baseDelta)) throw new BaseDeltaMustBeGreaterThanZero({ baseDelta })
  if (!gt(zero)(quoteDelta)) throw new QuoteDeltaMustBeGreaterThanZero({ quoteDelta })
  return { baseDelta, quoteDelta }
}

/**
 * NOTE: actual deltas are always less than or equal to expected deltas (because of integer division)
 * NOTE: sell deltas are positive, but they should be subtracted from the current balances (not added)
 */
export const getSellDeltas = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (baseDeltaProposed: N) => {
  input(__filename, getSellDeltas, { baseSupplyCurrent, quoteSupplyCurrent, baseDeltaProposed })
  const { zero, one, num, add, sub, mul, div, min, max, abs, eq, lt, gt, lte, gte } = arithmetic
  /**
   * The following check is necessary because quoteSupplyCurrent may have extra residue from previous buy-sell cycles due to integer division
   */
  // This check should not be needed since baseSupply is the primary variable
  // if (eq(baseDeltaProposed, baseSupplyCurrent)) {
  //   return { baseDelta: baseSupplyCurrent, quoteDelta: quoteSupplyCurrent }
  // }
  const baseSupplyProposed = sub(baseSupplyCurrent, baseDeltaProposed)
  const quoteSupplyProposed = getQuoteSupply(arithmetic)(baseLimit, quoteOffset)(baseSupplyProposed)
  const baseDelta = sub(baseSupplyCurrent, baseSupplyProposed)
  const quoteDelta = sub(quoteSupplyCurrent, quoteSupplyProposed)
  inter(__filename, getSellDeltas, { baseDelta, quoteDelta })
  if (!gt(zero)(baseDelta)) throw new BaseDeltaMustBeGreaterThanZero({ baseDelta })
  if (!gt(zero)(quoteDelta)) throw new QuoteDeltaMustBeGreaterThanZero({ quoteDelta })
  return { baseDelta, quoteDelta }
}

export const byAssetWallet = (asset: Asset, wallet: Wallet) => <N>(balance: Balance<N>) => {
  return balance.asset === asset && balance.wallet === wallet
}

export const getBalancesBQ = (baseAsset: Asset, quoteAsset: Asset) => (wallet: Wallet) => <N>(balances: Balance<N>[]) => {
  const base = getBalance(baseAsset)(wallet)(balances)
  const quote = getBalance(quoteAsset)(wallet)(balances)
  return { base, quote }
}

export const getAmountsBQ = (baseAsset: Asset, quoteAsset: Asset) => (wallet: Wallet) => <N>(balances: Balance<N>[]) => {
  const balancesBQ = getBalancesBQ(baseAsset, quoteAsset)(wallet)(balances)
  return { base: balancesBQ.base.amount, quote: balancesBQ.quote.amount }
}

export const getBalance = (asset: Asset) => (wallet: Wallet) => <N>(balances: Balance<N>[]) => {
  return ensureFind(balances, byAssetWallet(asset, wallet))
}

export const getAmount = (asset: Asset) => (wallet: Wallet) => <N>(balances: Balance<N>[]) => {
  return getBalance(asset)(wallet)(balances).amount
}

const getBalanceMutators = <N>(arithmetic: Arithmetic<N>) => {
  const { add, sub, mul, div } = arithmetic
  return {
    addB: (delta: N) => (balance: Balance<N>) => { balance.amount = add(balance.amount, delta) },
    subB: (delta: N) => (balance: Balance<N>) => { balance.amount = sub(balance.amount, delta) },
    mulB: (coefficient: N) => (balance: Balance<N>) => { balance.amount = mul(balance.amount, coefficient) },
    divB: (coefficient: N) => (balance: Balance<N>) => { balance.amount = div(balance.amount, coefficient) },
    sendB: (delta: N) => (from: Balance<N>, to: Balance<N>) => {
      from.amount = sub(from.amount, delta)
      to.amount = add(to.amount, delta)
    },
  }
}

export const getTotalSupply = <N>(arithmetic: Arithmetic<N>) => (asset: Asset) => (balances: Balance<N>[]) => sumAmounts(arithmetic)(balances.filter(b => b.asset === asset))

/**
 * @deprecated
 */
export const getQuoteSupplyAcceptableMax = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => {
  const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
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
export const getBaseSupplySuperlinearMin = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => {
  const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
  const initialPrice = getInitialPrice(arithmetic)(baseLimit, quoteOffset)
  const denominator = add(initialPrice, one)
  return div(baseLimit, denominator)
}

export const getBaseSupplySuperlinearMinC = toContextFun(getBaseSupplySuperlinearMin)

export const getInitialPrice = <N>({ div }: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => {
  return div(quoteOffset, baseLimit)
}

export const getBaseSuppliesFromBaseDeltas = <N>({ add, zero }: Arithmetic<N>) => meldWithLast(add, zero)

export const getQuoteDeltasFromBaseDeltas = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (baseDeltas: N[]) => {
  const baseSupplies = getBaseSuppliesFromBaseDeltas(arithmetic)(baseDeltas)
  return baseSupplies.map(getQuoteSupplyFor(arithmetic)(baseLimit, quoteOffset))
}

export const getQuoteDeltasFromBaseDeltasC = toContextFun(getQuoteDeltasFromBaseDeltas)

/**
 * Currently this function is called in every action. This is suboptimal, must be refactored (requires moving baseLimit and quoteOffset to State)
 */
export const validateContext = <N>(context: Context<N>) => {
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = context
  const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
  const assert = getAssert(arithmetic)
  const quoteOffsetCalculated = pipe(quoteOffset, div(baseLimit), mul(baseLimit))
  assert.gt(baseLimit, zero, 'baseLimit', 'zero')
  assert.gt(quoteOffset, zero, 'quoteOffset', 'zero')
  assert.lt(baseLimit, quoteOffset, 'baseLimit', 'quoteOffset', 'Required for lt(baseDelta, quoteDelta)')
  assert.eq(quoteOffsetCalculated, quoteOffset, 'quoteOffsetCalculated', 'quoteOffset', 'Required for quoteOffset = k * baseLimit')
  return context
}

export const validateBalances = <N>(context: Context<N>) => (contract: Address) => (balances: Balance<N>[]) => {
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = context
  const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
  const baseSupplyActual = getTotalSupply(arithmetic)(baseAsset)(balances)
  const quoteSupplyActual = getAmount(quoteAsset)(contract)(balances)
  const baseSupplyExpected = getBaseSupply(arithmetic)(baseLimit, quoteOffset)(quoteSupplyActual)
  const quoteSupplyExpected = getQuoteSupply(arithmetic)(baseLimit, quoteOffset)(baseSupplyActual)
  // const quoteSupplyAcceptableMax = getQuoteSupplyAcceptableMax(arithmetic)(baseLimit, quoteOffset)
  inter(__filename, validateBalances, { baseSupplyActual, baseSupplyExpected })
  inter(__filename, validateBalances, { quoteSupplyActual, quoteSupplyExpected })
  // NOTE: baseSupplyExpected >= baseSupplyActual
  // NOTE: quoteSupplyExpected >= quoteSupplyActual
  // const differBy = isDiffLte(arithmetic)
  // assertBy(differBy(baseLimit), 'differBy(baseLimit)')(baseSupplyActual, baseSupplyExpected, 'baseSupplyActual', 'baseSupplyExpected')
  // assertBy(differBy(quoteOffset), 'differBy(quoteOffset)')(quoteSupplyActual, quoteSupplyExpected, 'quoteSupplyActual', 'quoteSupplyExpected')
  // assertBy(lte)(quoteSupplyActual, quoteSupplyAcceptableMax, 'quoteSupplyActual', 'quoteSupplyAcceptableMax')
  assertBy(gte)(baseSupplyActual, baseSupplyExpected, 'baseSupplyActual', 'baseSupplyExpected', 'baseSupply* must be gte, not eq, because they are calculated imprecisely from quoteSupply')
  assertBy(eq)(quoteSupplyActual, quoteSupplyExpected, 'quoteSupplyActual', 'quoteSupplyExpected', 'quoteSupply* must be eq, not lte, because they are calculated precisely from baseSupply')
  assertBy(isEqualBy(eq(zero)), 'isEqualBy(eq(zero))')(baseSupplyActual, quoteSupplyActual, 'baseSupplyActual', 'quoteSupplyActual') // isZero(baseSupplyActual) === isZero(quoteSupplyActual)
  return balances
}

export const buy = <N extends WithToString>(context: Context<N>) => (contract: Address, sender: Address, quoteDeltaProposed: N) => ($balances: Balance<N>[]) => {
  input(__filename, buy, { contract, sender, quoteDeltaProposed })
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = validateContext(context)
  const { add, sub, mul, div, zero, gt, gte } = arithmetic
  const { addB, subB, mulB, divB, sendB } = getBalanceMutators(arithmetic)
  const balances = clone($balances)
  const getBalancesLocal = getBalancesBQ(baseAsset, quoteAsset)
  const balancesContract = getBalancesLocal(contract)(balances)
  const balancesSender = getBalancesLocal(sender)(balances)
  const baseSupplyCurrent = getTotalSupply(arithmetic)(baseAsset)(balances)
  const quoteSupplyCurrent = balancesContract.quote.amount
  const { baseDelta, quoteDelta } = getBuyDeltas(arithmetic)(baseLimit, quoteOffset)(baseSupplyCurrent, quoteSupplyCurrent)(quoteDeltaProposed)
  sendB(quoteDelta)(balancesSender.quote, balancesContract.quote)
  addB(baseDelta)(balancesSender.base)
  return validateBalances(context)(contract)(balances)
}

export const sell = <N extends WithToString>(context: Context<N>) => (contract: Address, sender: Address, baseDeltaProposed: N) => ($balances: Balance<N>[]) => {
  input(__filename, sell, { contract, sender, baseDeltaProposed })
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = validateContext(context)
  const { add, sub, mul, div, zero, gt, gte } = arithmetic
  const { addB, subB, mulB, divB, sendB } = getBalanceMutators(arithmetic)
  const balances = clone($balances)
  const getBalancesLocal = getBalancesBQ(baseAsset, quoteAsset)
  const balancesContract = getBalancesLocal(contract)(balances)
  const balancesSender = getBalancesLocal(sender)(balances)
  const baseSupplyCurrent = getTotalSupply(arithmetic)(baseAsset)(balances)
  const quoteSupplyCurrent = balancesContract.quote.amount
  const { baseDelta, quoteDelta } = getSellDeltas(arithmetic)(baseLimit, quoteOffset)(baseSupplyCurrent, quoteSupplyCurrent)(baseDeltaProposed)
  sendB(quoteDelta)(balancesContract.quote, balancesSender.quote)
  subB(baseDelta)(balancesSender.base)
  return validateBalances(context)(contract)(balances)
}

export const selloff = <N extends WithToString>(context: Context<N>) => (contract: Address, sender: Address) => ($balances: Balance<N>[]) => {
  const { baseAsset, quoteAsset } = validateContext(context)
  const baseDelta = getBalancesBQ(baseAsset, quoteAsset)(sender)($balances).base.amount
  // const amountQuoteSender = getAmount(balances)(quoteAsset)(sender)
  return sell(context)(contract, sender, baseDelta)($balances)
}

export const getBalanceRendered = <N extends WithToString>(balance: Balance<N>) => toBalanceGenTuple(balance).map(v => v.toString())

export const getBalancesRendered = map(getBalanceRendered)

export const getBalancesEvolution = <N>(asset: string, sender: string) => (balancesEvolution: Balance<N>[][]) => balancesEvolution.map(getFinder(byAssetWallet(asset, sender)))

export const getStats = <N>(context: Context<N>) => (scale: N) => (start: number, end: number, multiplier: number) => {
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = context
  const { zero, one, num, add, sub, mul, div, min, max, abs, eq, lt, gt, lte, gte } = arithmetic
  const upscale = mul(scale)
  const baseLimitScaled = upscale(baseLimit)
  const quoteOffsetScaled = upscale(quoteOffset)
  const quoteSupplyAcceptableMax = getQuoteSupplyAcceptableMax(arithmetic)(baseLimitScaled, quoteOffsetScaled)
  return range(start, end).map(n => {
    const quoteSupply = upscale(num(n * multiplier))
    const baseSupplyCalc = getBaseSupply(arithmetic)(baseLimitScaled, quoteOffsetScaled)(quoteSupply)
    const quoteSupplyCalc = getQuoteSupply(arithmetic)(baseLimitScaled, quoteOffsetScaled)(baseSupplyCalc)
    const diff = sub(quoteSupply, quoteSupplyCalc)
    const isOptimal = diff === 0n && quoteSupply !== 0n
    const isAcceptableMax = eq(quoteSupply, quoteSupplyAcceptableMax)
    return { baseSupplyCalc, quoteSupply, quoteSupplyCalc, diff, isOptimal, isAcceptableMax }
  })
}
