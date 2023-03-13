import { pipe } from 'remeda'
import { Address as EthAddress } from '../../ethereum/models/Address'
import { BigIntBasicOperations } from '../../utils/bigint/BigIntBasicOperations'
import { ensureFind } from '../../utils/ensure'
import { Asset } from './models/Asset'
import { Balance as ImBalance } from './models/Balance'
import { Fint } from './models/Fint'
import { byAssetWallet, Fairpool, State } from './uni'
import { validateBalance } from './validators/validateBalance'

const { sumAmounts } = BigIntBasicOperations

export const getBalancesBQ = (baseAsset: Asset, quoteAsset: Asset) => (wallet: EthAddress) => (balances: Fint[]) => {
  const base = getBalanceR(baseAsset)(wallet)(balances)
  const quote = getBalanceR(quoteAsset)(wallet)(balances)
  return {
    base,
    quote,
  }
}

export const getAmountsBQ = (baseAsset: Asset, quoteAsset: Asset) => (wallet: EthAddress) => (balances: Fint[]) => {
  const balancesBQ = getBalancesBQ(baseAsset, quoteAsset)(wallet)(balances)
  return {
    base: balancesBQ.base.amount,
    quote: balancesBQ.quote.amount,
  }
}

export const getBalance = (address: EthAddress) => (balances: ImBalance[]) => ensureFind(balances, f => f.address === address)

export const findBalance = (address: EthAddress) => (balances: ImBalance[]) => balances.find(f => f.address === address)

export const getBalanceD = (address: EthAddress) => (balances: ImBalance[]) => findBalance(address)(balances) || getBalanceZero(address)

export const getBalanceR = (asset: Asset) => (wallet: EthAddress) => (fints: Fint[]) => ensureFind(fints, byAssetWallet(asset, wallet))

export const getBalanceZero = (address: string) => validateBalance({ address, amount: 0n })

/**
 * IMPORTANT: This function mutates balances!
 */
export const grabBalance = (address: EthAddress) => (balances: ImBalance[]) => {
  const balanceOld = balances.find(f => f.address === address)
  if (balanceOld) {
    return balanceOld
  } else {
    const balanceNew = getBalanceZero(address)
    balances.push(balanceNew)
    return balanceNew
  }
}

export const getAmount = (address: EthAddress) => (balances: ImBalance[]) => getBalance(address)(balances).amount

export const getAmountD = (address: EthAddress) => (balances: ImBalance[]) => getBalanceD(address)(balances).amount

export const getAmountF = (fairpool: Fairpool) => (state: State) => getAmount(fairpool.address)(state.blockchain.balances)

export const getAmountR = (asset: Asset) => (wallet: EthAddress) => (fints: Fint[]) => getBalanceR(asset)(wallet)(fints).amount

export const getTotalSupply = sumAmounts

export const getTotalSupplyR = (asset: Asset) => (fints: Fint[]) => pipe(fints.filter(b => b.asset === asset), getTotalSupply)

export const getTotalSupplyF = (fairpool: Fairpool) => getTotalSupply(fairpool.balances)

export const getBaseSupplyActual = getTotalSupplyF

export const logState = (state: State) => {
  console.dir(state, { depth: null })
  return state
}
