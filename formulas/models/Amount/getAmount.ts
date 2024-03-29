import { GetBalance, getBalanceBase, getBalanceQuote } from '../Balance/getBalance'
import { State } from '../State'
import { Amount } from './index'
import { Address } from '../Address'

export type GetAmount = (address: Address) => (state: State) => Amount

export const getGetAmountFromGetBalance = (getBalance: GetBalance): GetAmount => (address: Address) => (state: State) => getBalance(address)(state).amount

export const getAmountBase = getGetAmountFromGetBalance(getBalanceBase)

export const getAmountQuote = getGetAmountFromGetBalance(getBalanceQuote)
