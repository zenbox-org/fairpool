import { addUint, subUint } from '../../../ethereum/math'
import { AmountBN } from '../../../ethereum/models/AmountBN'
import { BalanceUint256BN } from '../../../ethereum/models/BalanceUint256BN'

export function moveAmount(amount: AmountBN, from: BalanceUint256BN, to: BalanceUint256BN) {
  from.amount = subUint(from.amount, amount)
  to.amount = addUint(to.amount, amount)
}
