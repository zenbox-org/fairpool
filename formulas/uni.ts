import { Arithmetic } from '../../utils/arithmetic'
import { Address } from '../../../models/Address'
import { ensureFind, getFinder } from '../../utils/ensure'
import { clone, map } from 'remeda'
import { BalanceGen } from '../../finance/models/BalanceGen'
import { toBalanceGenArray } from '../../finance/models/BalanceGen/toBalanceGenArray'
import { WithToString } from '../../utils/string'
import { sumAmounts } from '../../utils/arithmetic/sum'
import { AssertionFailedError } from '../../utils/error'
import { Mutator } from '../../generic/models/Mutator'
import { debug } from '../../utils/debug'

export type Wallet = string

export type Asset = string

export type Balance<Amount> = BalanceGen<Wallet, Asset, Amount>

export type Action<N> = Mutator<Balance<N>[]>

export interface Context<N> {
  arithmetic: Arithmetic<N>
  baseAsset: Asset
  quoteAsset: Asset
  baseLimit: N,
  quoteBuffer: N
}

export class BaseDeltaMustBeGreaterThanZero<N> extends AssertionFailedError<{ baseDelta: N }> {}

export class QuoteDeltaMustBeGreaterThanZero<N> extends AssertionFailedError<{ quoteDelta: N }> {}

export const getBaseSupply = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteBuffer: N) => (quoteSupply: N) => {
  const { add, sub, mul, div } = arithmetic
  const numerator = mul(baseLimit, quoteSupply)
  const denominator = add(quoteBuffer, quoteSupply)
  return div(numerator, denominator)
}

export const getQuoteSupply = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteBuffer: N) => (baseSupply: N) => {
  const { add, sub, mul, div } = arithmetic
  const numerator = mul(quoteBuffer, baseSupply)
  const denominator = sub(baseLimit, baseSupply)
  return div(numerator, denominator)
}

export const getBaseDelta = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteBuffer: N) => (baseSupplyCurrent: N, quoteSupplyNew: N) => {
  const { add, sub, mul, div } = arithmetic
  const baseSupplyNew = getBaseSupply(arithmetic)(baseLimit, quoteBuffer)(quoteSupplyNew)
  return sub(baseSupplyNew, baseSupplyCurrent)
}

export const getQuoteDelta = <N>(arithmetic: Arithmetic<N>) => (baseLimit: N, quoteBuffer: N) => (baseSupplyNew: N, quoteSupplyCurrent: N) => {
  const { add, sub, mul, div } = arithmetic
  const quoteSupplyNew = getQuoteSupply(arithmetic)(baseLimit, quoteBuffer)(baseSupplyNew)
  return sub(quoteSupplyCurrent, quoteSupplyNew)
}

export const byAssetWallet = (asset: Asset, wallet: Wallet) => <N>(balance: Balance<N>) => {
  return balance.asset === asset && balance.wallet === wallet
}

export const getBalancesBQ = <N>(balances: Balance<N>[]) => (baseAsset: Asset, quoteAsset: Asset) => (wallet: Wallet) => {
  const base = getBalance(baseAsset)(wallet)(balances)
  const quote = getBalance(quoteAsset)(wallet)(balances)
  return { base, quote }
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

const getTotalSupply = <N>(arithmetic: Arithmetic<N>) => (asset: Asset) => (balances: Balance<N>[]) => sumAmounts(arithmetic)(balances.filter(b => b.asset === asset))

export const buy = <N extends WithToString>(context: Context<N>) => (contract: Address, sender: Address, quoteDelta: N) => ($balances: Balance<N>[]) => {
  debug(__filename, buy, contract, sender, quoteDelta)
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteBuffer } = context
  const { add, sub, mul, div, zero, gt, gte } = arithmetic
  const { addB, subB, mulB, divB, sendB } = getBalanceMutators(arithmetic)
  const balances = clone($balances)
  const getBalancesLocal = getBalancesBQ(balances)(baseAsset, quoteAsset)
  const balancesContract = getBalancesLocal(contract)
  const balancesSender = getBalancesLocal(sender)
  const baseSupplyCurrent = getTotalSupply(arithmetic)(baseAsset)(balances)
  const quoteSupplyCurrent = balancesContract.quote.amount
  const quoteSupplyNew = add(quoteDelta)(quoteSupplyCurrent)
  const baseDelta = getBaseDelta(arithmetic)(baseLimit, quoteBuffer)(baseSupplyCurrent, quoteSupplyNew)
  debug(__filename, buy, { baseDelta })
  if (!gt(zero)(baseDelta)) throw new BaseDeltaMustBeGreaterThanZero({ baseDelta })
  if (!gt(zero)(quoteDelta)) throw new QuoteDeltaMustBeGreaterThanZero({ quoteDelta })
  sendB(quoteDelta)(balancesSender.quote, balancesContract.quote)
  addB(baseDelta)(balancesSender.base)
  return balances
}

export const sell = <N extends WithToString>(context: Context<N>) => (contract: Address, sender: Address, baseDelta: N) => ($balances: Balance<N>[]) => {
  debug(__filename, sell, contract, sender, baseDelta)
  const { arithmetic, baseAsset, quoteAsset, baseLimit, quoteBuffer } = context
  const { add, sub, mul, div, zero, gt, gte } = arithmetic
  const { addB, subB, mulB, divB, sendB } = getBalanceMutators(arithmetic)
  const balances = clone($balances)
  const getBalancesLocal = getBalancesBQ(balances)(baseAsset, quoteAsset)
  const balancesContract = getBalancesLocal(contract)
  const balancesSender = getBalancesLocal(sender)
  const baseSupplyCurrent = sumAmounts(arithmetic)(balances.filter(b => b.asset === baseAsset))
  const quoteSupplyCurrent = balancesContract.quote.amount
  const baseSupplyNew = sub(baseDelta)(baseSupplyCurrent)
  const quoteDelta = getQuoteDelta(arithmetic)(baseLimit, quoteBuffer)(baseSupplyNew, quoteSupplyCurrent)
  if (!gt(zero)(baseDelta)) throw new BaseDeltaMustBeGreaterThanZero({ baseDelta })
  if (!gt(zero)(quoteDelta)) throw new QuoteDeltaMustBeGreaterThanZero({ quoteDelta })
  debug(__filename, sell, { quoteDelta })
  sendB(quoteDelta)(balancesContract.quote, balancesSender.quote)
  subB(baseDelta)(balancesSender.base)
  return balances
}

export const selloff = <N extends WithToString>(context: Context<N>) => (contract: Address, sender: Address) => ($balances: Balance<N>[]) => {
  const { baseAsset, quoteAsset } = context
  const baseDelta = getBalancesBQ($balances)(baseAsset, quoteAsset)(sender).base.amount
  // const amountQuoteSender = getAmount(balances)(quoteAsset)(sender)
  return sell(context)(contract, sender, baseDelta)($balances)
}

export const getBalanceRendered = <N extends WithToString>(balance: Balance<N>) => toBalanceGenArray(balance).map(v => v.toString())

export const getBalancesRendered = map(getBalanceRendered)

export const getBalancesEvolution = <N>(asset: string, sender: string) => (balancesEvolution: Balance<N>[][]) => balancesEvolution.map(getFinder(byAssetWallet(asset, sender)))
