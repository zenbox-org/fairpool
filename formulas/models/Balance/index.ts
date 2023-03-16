import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { AddressSchema } from '../Address'
import { AmountSchema } from '../Amount'

export const BalanceSchema = z.object({
  address: AddressSchema,
  amount: AmountSchema,
}).describe('Balance')

export const BalanceUidSchema = BalanceSchema.pick({
  address: true,
})

export const BalancesSchema = getArraySchema(BalanceSchema, parseBalanceUid)

export type Balance = z.infer<typeof BalanceSchema>

export type BalanceUid = z.infer<typeof BalanceUidSchema>

export function parseBalance(balance: Balance): Balance {
  return BalanceSchema.parse(balance)
}

export function parseBalances(balances: Balance[]): Balance[] {
  return BalancesSchema.parse(balances)
}

export function parseBalanceUid(balanceUid: BalanceUid): BalanceUid {
  return BalanceUidSchema.parse(balanceUid)
}

export const isEqualBalance = isEqualByDC(parseBalanceUid)
