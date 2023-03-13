import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { AddressSchema } from '../../../../../ethereum/models/Address'
import { Uint256BigIntSchema } from '../../../../../ethereum/models/Uint256BigInt'

export const BuySchema = z.object({
  name: z.literal('buy'),
  contract: AddressSchema,
  sender: AddressSchema,
  quoteDeltaProposed: Uint256BigIntSchema,
}).describe('Buy')

export const BuyUidSchema = BuySchema

export const BuysSchema = getArraySchema(BuySchema, parseBuyUid)

export type Buy = z.infer<typeof BuySchema>

export type BuyUid = z.infer<typeof BuyUidSchema>

export function parseBuy(buy: Buy): Buy {
  return BuySchema.parse(buy)
}

export function parseBuys(buys: Buy[]): Buy[] {
  return BuysSchema.parse(buys)
}

export function parseBuyUid(buyUid: BuyUid): BuyUid {
  return BuyUidSchema.parse(buyUid)
}

export const isEqualBuy = isEqualByDC(parseBuyUid)
