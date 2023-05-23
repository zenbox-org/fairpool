import { getFairpool } from '../../model'
import { State } from '../State'
import { getBalanceD } from './helpers'
import { Balance } from './index'
import { Address } from '../Address'

export type GetBalance = (address: Address) => (state: State) => Balance

export const getBalanceQuote: GetBalance = (address: Address) => (state: State) => getBalanceD(address)(state.blockchain.balances)

export const getBalanceBase: GetBalance = (address: Address) => (state: State) => getBalanceD(address)(getFairpool(state).balances)
