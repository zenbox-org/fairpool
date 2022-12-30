import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { AmountBNPrimitiveSchema } from '../../ethereum/models/AmountBNPrimitive'

export const TokenDataPrimitiveSchema = z.object({
  baseDailyVolume: AmountBNPrimitiveSchema,
  quoteDailyVolume: AmountBNPrimitiveSchema,
}).describe('TokenDataPrimitive')

export const TokenDataPrimitiveUidSchema = TokenDataPrimitiveSchema.pick({

})

export const TokenDataPrimitivesSchema = getArraySchema(TokenDataPrimitiveSchema, parseTokenDataPrimitiveUid)

export type TokenDataPrimitive = z.infer<typeof TokenDataPrimitiveSchema>

export type TokenDataPrimitiveUid = z.infer<typeof TokenDataPrimitiveUidSchema>

export function parseTokenDataPrimitive(data: TokenDataPrimitive): TokenDataPrimitive {
  return TokenDataPrimitiveSchema.parse(data)
}

export function parseTokenDataPrimitives(datas: TokenDataPrimitive[]): TokenDataPrimitive[] {
  return TokenDataPrimitivesSchema.parse(datas)
}

export function parseTokenDataPrimitiveUid(dataUid: TokenDataPrimitiveUid): TokenDataPrimitiveUid {
  return TokenDataPrimitiveUidSchema.parse(dataUid)
}

export const isEqualTokenDataPrimitive = isEqualByDC(parseTokenDataPrimitiveUid)
