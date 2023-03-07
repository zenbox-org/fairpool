import { BigIntAllAssertions } from '../../../utils/bigint.arithmetic'
import { Balance } from '../uni'

const assert = BigIntAllAssertions

export const validateBalances = (balances: Balance[]) => {
  return balances.map(validateBalance)
}

export const validateBalance = (balance: Balance) => {
  const { amount } = balance
  assert.gte(amount, 0n, 'amount', '0n', { balance })
  return balance
}
