import { Address } from '../../../../ethereum/models/Address'
import { getFairpool } from '../../contract'
import { State } from '../State'
import { getBalanceD } from './helpers'
import { Balance } from './index'

export type GetBalance = (address: Address) => (state: State) => Balance

export const getBalanceQuote: GetBalance = (address: Address) => (state: State) => getBalanceD(address)(state.blockchain.balances)

export const getBalanceBase: GetBalance = (address: Address) => (state: State) => getBalanceD(address)(getFairpool(state).balances)
