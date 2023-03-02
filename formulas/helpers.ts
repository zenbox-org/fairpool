import { pipe } from 'remeda'
import { sumAmounts } from '../../utils/arithmetic/sum'
import { BigIntArithmetic } from '../../utils/bigint/BigIntArithmetic'
import { ensureFind } from '../../utils/ensure'
import { Address, Asset, Balance, byAssetWallet, Fairpool, Fint, State } from './uni'
import { validateBalance } from './validators/validateBalance'

export const getBalancesBQ = (baseAsset: Asset, quoteAsset: Asset) => (wallet: Address) => (balances: Fint[]) => {
  const base = getBalanceR(baseAsset)(wallet)(balances)
  const quote = getBalanceR(quoteAsset)(wallet)(balances)
  return {
    base,
    quote,
  }
}

export const getAmountsBQ = (baseAsset: Asset, quoteAsset: Asset) => (wallet: Address) => (balances: Fint[]) => {
  const balancesBQ = getBalancesBQ(baseAsset, quoteAsset)(wallet)(balances)
  return {
    base: balancesBQ.base.amount,
    quote: balancesBQ.quote.amount,
  }
}

export const getBalance = (address: Address) => (balances: Balance[]) => ensureFind(balances, f => f.address === address)

export const findBalance = (address: Address) => (balances: Balance[]) => balances.find(f => f.address === address)

export const getBalanceD = (address: Address) => (balances: Balance[]) => findBalance(address)(balances) || getBalanceZero(address)

export const getBalanceR = (asset: Asset) => (wallet: Address) => (fints: Fint[]) => ensureFind(fints, byAssetWallet(asset, wallet))

export const getBalanceZero = (address: string) => validateBalance({ address, amount: 0n })

/**
 * IMPORTANT: This function mutates balances!
 */
export const grabBalance = (address: Address) => (balances: Balance[]) => {
  const balanceOld = balances.find(f => f.address === address)
  if (balanceOld) {
    return balanceOld
  } else {
    const balanceNew = getBalanceZero(address)
    balances.push(balanceNew)
    return balanceNew
  }
}

export const getAmount = (address: Address) => (balances: Balance[]) => getBalance(address)(balances).amount

export const getAmountD = (address: Address) => (balances: Balance[]) => getBalanceD(address)(balances).amount

export const getAmountF = (fairpool: Fairpool) => (state: State) => getAmount(fairpool.address)(state.blockchain.balances)

export const getAmountR = (asset: Asset) => (wallet: Address) => (fints: Fint[]) => getBalanceR(asset)(wallet)(fints).amount

export const getTotalSupply = sumAmounts(BigIntArithmetic)

export const getTotalSupplyR = (asset: Asset) => (fints: Fint[]) => pipe(fints.filter(b => b.asset === asset), getTotalSupply)

export const getTotalSupplyF = (fairpool: Fairpool) => getTotalSupply(fairpool.balances)

export const getBaseSupplyActual = getTotalSupplyF

export const logState = (state: State) => {
  console.dir(state, { depth: null })
  return state
}
