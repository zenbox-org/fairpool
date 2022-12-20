import { sumAmountBNs } from '../../../ethereum/models/AmountBN/sumAmountBNs'
import { Token } from '../Token'

export function getTotalSupply(token: Token) {
  return sumAmountBNs(token.balances)
}
