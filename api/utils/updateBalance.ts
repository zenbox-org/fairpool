import { addUint, subUint } from '../../../ethereum/math'
import { Address } from '../../../ethereum/models/Address'
import { AmountBN } from '../../../ethereum/models/AmountBN'
import { Token } from '../../models/Token'

export const updateBalance = (update: (a: AmountBN, b: AmountBN) => AmountBN) => (token: Token, address: Address, baseDelta: AmountBN) => {
  const balance = token.balances.find(b => b.address === address)
  if (balance) {
    balance.amount = update(balance.amount, baseDelta)
  } else {
    token.balances.push({
      address,
      amount: baseDelta,
    })
  }
}

export const addBalance = updateBalance(addUint)

export const subBalance = updateBalance(subUint)
