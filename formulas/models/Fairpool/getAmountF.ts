import { getAmount } from '../../helpers/getAmount'
import { State } from '../State'
import { Fairpool } from './index'

export const getAmountF = (fairpool: Fairpool) => (state: State) => getAmount(fairpool.address)(state.blockchain.balances)
