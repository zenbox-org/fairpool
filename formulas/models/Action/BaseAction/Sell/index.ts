import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { Uint256BigIntSchema } from '../../../../../../ethereum/models/Uint256BigInt'
import { BaseActionSchema } from '../index'

export const BaseSellSchema = BaseActionSchema.extend({
  baseDeltaProposed: Uint256BigIntSchema,
}).describe('Sell')

export const SellSchema = BaseSellSchema.extend({
  type: z.literal('sell'),
})

export const SellUidSchema = SellSchema

export const SellsSchema = getArraySchema(SellSchema, parseSellUid)

export type Sell = z.infer<typeof SellSchema>

export type SellUid = z.infer<typeof SellUidSchema>

export function parseSell(sell: Sell): Sell {
  return SellSchema.parse(sell)
}

export function parseSells(sells: Sell[]): Sell[] {
  return SellsSchema.parse(sells)
}

export function parseSellUid(sellUid: SellUid): SellUid {
  return SellUidSchema.parse(sellUid)
}

export const isEqualSell = isEqualByDC(parseSellUid)
