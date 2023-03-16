import { ensureFind } from '../../../../utils/ensure'
import { byAssetWallet } from '../../helpers/byAssetWallet'
import { Address } from '../Address'
import { Asset } from '../Asset'
import { Fint } from '../Fint'
import { Balance, parseBalance } from './index'

export const getBalance = (address: Address) => (balances: Balance[]) => ensureFind(balances, f => f.address === address)

export const findBalance = (address: Address) => (balances: Balance[]) => balances.find(f => f.address === address)

export const getBalanceD = (address: Address) => (balances: Balance[]) => findBalance(address)(balances) || getBalanceZero(address)

export const getBalanceR = (asset: Asset) => (wallet: Address) => (fints: Fint[]) => ensureFind(fints, byAssetWallet(asset, wallet))

export const getBalanceZero = (address: string) => parseBalance({
  address,
  amount: 0n,
})

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
