import { sumBNs } from '../../../bn/utils'
import { sumAmountBNs } from '../../../ethereum/models/AmountBN/sumAmountBNs'
import { State } from '../models/State'

export function getNativeTotalSupply(state: State) {
  const totals = [state.wallets, state.tokens].map(sumAmountBNs)
  return sumBNs(totals)
}
