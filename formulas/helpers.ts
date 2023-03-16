import { Address } from '../../ethereum/models/Address'
import { BigIntAdvancedOperations } from '../../utils/bigint/BigIntAdvancedOperations'
import { getTotalSupplyF } from './helpers/getTotalSupply'
import { Asset } from './models/Asset'
import { getBalanceR } from './models/Balance/helpers'
import { Fint } from './models/Fint'
import { State } from './models/State'

const { sumAmounts } = BigIntAdvancedOperations

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

export const getBaseSupplyActual = getTotalSupplyF

export const logState = (state: State) => {
  console.dir(state, { depth: null })
  return state
}
