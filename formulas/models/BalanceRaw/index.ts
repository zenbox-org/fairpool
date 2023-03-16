import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { uint256MaxN } from '../../../../ethereum/constants'
import { Uint256BigIntSchema } from '../../../../ethereum/models/Uint256BigInt'
import { AddressSchema } from '../Address'

export const BalanceRawSchema = z.object({
  address: AddressSchema,
  amount: Uint256BigIntSchema.min(-uint256MaxN), // allow negative amounts
}).describe('BalanceRaw')

export const BalanceRawUidSchema = BalanceRawSchema.pick({

})

export const BalanceRawsSchema = getArraySchema(BalanceRawSchema, parseBalanceRawUid)

export type BalanceRaw = z.infer<typeof BalanceRawSchema>

export type BalanceRawUid = z.infer<typeof BalanceRawUidSchema>

export function parseBalanceRaw(balance: BalanceRaw): BalanceRaw {
  return BalanceRawSchema.parse(balance)
}

export function parseBalanceRaws(balances: BalanceRaw[]): BalanceRaw[] {
  return BalanceRawsSchema.parse(balances)
}

export function parseBalanceRawUid(balanceUid: BalanceRawUid): BalanceRawUid {
  return BalanceRawUidSchema.parse(balanceUid)
}

export const isEqualBalanceRaw = isEqualByDC(parseBalanceRawUid)
