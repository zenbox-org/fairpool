import { Address } from '../models/Address'
import { Asset } from '../models/Asset'
import { Balance } from '../models/Balance'
import { getBalance, getBalanceD, getBalanceR } from '../models/Balance/helpers'
import { Fint } from '../models/Fint'

export const getAmount = (address: Address) => (balances: Balance[]) => getBalance(address)(balances).amount

export const getAmountD = (address: Address) => (balances: Balance[]) => getBalanceD(address)(balances).amount

export const getAmountR = (asset: Asset) => (wallet: Address) => (fints: Fint[]) => getBalanceR(asset)(wallet)(fints).amount
