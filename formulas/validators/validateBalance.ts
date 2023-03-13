import { BigIntAllAssertions } from '../../../utils/bigint/BigIntBasicArithmetic'
import { Balance as ImBalance } from '../models/Balance'

const assert = BigIntAllAssertions

export const validateBalances = (balances: ImBalance[]) => {
  return balances.map(validateBalance)
}

export const validateBalance = (balance: ImBalance) => {
  const { amount } = balance
  assert.gte(amount, 0n, 'amount', '0n', { balance })
  return balance
}
