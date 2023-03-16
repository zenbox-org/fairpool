import { ensureByIndex } from '../../../../utils/ensure'
import { State } from '../State'

export const getBalancesBase = (state: State, index = 0) => ensureByIndex(state.fairpools, index).balances

export const getBalancesQuote = (state: State) => state.blockchain.balances
