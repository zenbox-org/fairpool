import { Arithmetic } from '../../utils/arithmetic'
import { Address } from '../../ethereum/models/Address'
import { ensureFind, getFinder } from '../../utils/ensure'
import { clone, map, range } from 'remeda'
import { BalanceGen, BalanceGenTuple } from '../../finance/models/BalanceGen'
import { toBalanceGenTuple } from '../../finance/models/BalanceGen/toBalanceGenTuple'
import { WithToString } from '../../utils/string'
import { sumAmounts } from '../../utils/arithmetic/sum'
import { AssertionFailedError } from '../../utils/error'
import { Mutator } from '../../generic/models/Mutator'
import { input, inter } from '../../utils/debug'
import { assertBy } from '../../utils/assert'
import { isEqualBy } from '../../utils/lodash'

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

export const getBaseSupply = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (quoteSupply: N) => {
  const { add, sub, mul, div } = arithmetic
  const numerator = mul(baseLimit, quoteSupply)
  const denominator = add(quoteOffset, quoteSupply)
  return div(numerator, denominator)
}

export const getQuoteSupply = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (baseSupply: N) => {
  const { add, sub, mul, div } = arithmetic
  const numerator = mul(quoteOffset, baseSupply)
  const denominator = sub(baseLimit, baseSupply)
  return div(numerator, denominator)
}

export const getBaseDelta = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (quoteDeltaProposed: N) => {
  const { add, sub, mul, div, gt, lte } = arithmetic
  const quoteSupplyNew = add(quoteSupplyCurrent, quoteDeltaProposed)
  const baseSupplyNew = getBaseSupply(arithmetic)(baseLimit, quoteOffset)(quoteSupplyNew)
  inter(__filename, getBaseDelta, { baseSupplyNew, quoteSupplyNew })
  return sub(baseSupplyNew, baseSupplyCurrent)
}

export const getQuoteDeltaMax = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => {
  const { sub, one } = arithmetic
  return getQuoteSupply(arithmetic)(baseLimit, quoteOffset)(sub(baseLimit, one))
}

export const getQuoteDelta = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (baseDeltaProposed: N) => {
  const { add, sub, mul, div } = arithmetic
  const baseSupplyNew = sub(baseSupplyCurrent, baseDeltaProposed)
  const quoteSupplyNew = getQuoteSupply(arithmetic)(baseLimit, quoteOffset)(baseSupplyNew)
  return sub(quoteSupplyCurrent, quoteSupplyNew)
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
  const quoteSupplyNew = add(quoteSupplyProposed, one)
  const baseSupplyNew = getBaseSupply(arithmetic)(baseLimit, quoteOffset)(quoteSupplyNew)
  const baseDelta = sub(baseSupplyCurrent, baseSupplyNew)
  const quoteDelta = sub(quoteSupplyCurrent, quoteSupplyNew)
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

const assertBalances = <N>(context: Context<N>) => (contract: Address) => (balances: Balance<N>[]) => {
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = context
  const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
  const baseSupplyActual = getTotalSupply(arithmetic)(baseAsset)(balances)
  const quoteSupplyActual = getAmount(quoteAsset)(contract)(balances)
  const baseSupplyExpected = getBaseSupply(arithmetic)(baseLimit, quoteOffset)(quoteSupplyActual)
  const quoteSupplyExpected = getQuoteSupply(arithmetic)(baseLimit, quoteOffset)(baseSupplyActual)
  const quoteSupplyAcceptableMax = getQuoteSupplyAcceptableMax(arithmetic)(baseLimit, quoteOffset)
  inter(__filename, assertBalances, { baseSupplyActual, baseSupplyExpected })
  inter(__filename, assertBalances, { quoteSupplyActual, quoteSupplyExpected, quoteSupplyAcceptableMax })
  // NOTE: baseSupplyExpected >= baseSupplyActual
  // NOTE: quoteSupplyExpected >= quoteSupplyActual
  // const differBy = isDiffLte(arithmetic)
  // assertBy(differBy(baseLimit), 'differBy(baseLimit)')(baseSupplyActual, baseSupplyExpected, 'baseSupplyActual', 'baseSupplyExpected')
  // assertBy(differBy(quoteOffset), 'differBy(quoteOffset)')(quoteSupplyActual, quoteSupplyExpected, 'quoteSupplyActual', 'quoteSupplyExpected')
  assertBy(lte)(quoteSupplyActual, quoteSupplyAcceptableMax, 'quoteSupplyActual', 'quoteSupplyAcceptableMax')
  assertBy(gte)(baseSupplyActual, baseSupplyExpected, 'baseSupplyActual', 'baseSupplyExpected', 'baseSupply* must be gte, not eq, because they are calculated imprecisely from quoteSupply')
  assertBy(eq)(quoteSupplyActual, quoteSupplyExpected, 'quoteSupplyActual', 'quoteSupplyExpected', 'quoteSupply* must be eq, not lte, because they are calculated precisely from baseSupply')
  assertBy(isEqualBy(eq(zero)), 'isEqualBy(eq(zero))')(baseSupplyActual, quoteSupplyActual, 'baseSupplyActual', 'quoteSupplyActual') // isZero(baseSupplyActual) === isZero(quoteSupplyActual)
  return balances
}

export const buy = <N extends WithToString>(context: Context<N>) => (contract: Address, sender: Address, quoteDeltaProposed: N) => ($balances: Balance<N>[]) => {
  input(__filename, buy, { contract, sender, quoteDeltaProposed })
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = context
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
  return assertBalances(context)(contract)(balances)
}

export const sell = <N extends WithToString>(context: Context<N>) => (contract: Address, sender: Address, baseDeltaProposed: N) => ($balances: Balance<N>[]) => {
  input(__filename, sell, { contract, sender, baseDeltaProposed })
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteOffset } = context
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
  return assertBalances(context)(contract)(balances)
}

export const selloff = <N extends WithToString>(context: Context<N>) => (contract: Address, sender: Address) => ($balances: Balance<N>[]) => {
  const { baseAsset, quoteAsset } = context
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
  return range(start, end).map(n => {
    const quoteSupply = upscale(num(n * multiplier))
    const baseSupplyCalc = getBaseSupply(arithmetic)(baseLimitScaled, quoteOffsetScaled)(quoteSupply)
    const quoteSupplyCalc = getQuoteSupply(arithmetic)(baseLimitScaled, quoteOffsetScaled)(baseSupplyCalc)
    const diff = sub(quoteSupply, quoteSupplyCalc)
    const isOptimal = diff === 0n && quoteSupply !== 0n
    return { baseSupplyCalc, quoteSupply, quoteSupplyCalc, diff, isOptimal }
  })
}
