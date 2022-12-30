import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { BuyParamsSchema } from './BuyParams'
import { AmountBNPrimitiveSchema } from '../../../ethereum/models/AmountBNPrimitive'

export const BuyParamsPrimitiveSchema = BuyParamsSchema.extend({
  quoteDeltaProposed: AmountBNPrimitiveSchema,
  baseDeltaMin: AmountBNPrimitiveSchema,
  deadline: AmountBNPrimitiveSchema,
}).describe('BuyParamsPrimitive')

export const BuyParamsPrimitiveUidSchema = BuyParamsPrimitiveSchema

export const BuyParamsPrimitivesSchema = getArraySchema(BuyParamsPrimitiveSchema, parseBuyParamsPrimitiveUid)

export type BuyParamsPrimitive = z.infer<typeof BuyParamsPrimitiveSchema>

export type BuyParamsPrimitiveUid = z.infer<typeof BuyParamsPrimitiveUidSchema>

export function parseBuyParamsPrimitive(params: BuyParamsPrimitive): BuyParamsPrimitive {
  return BuyParamsPrimitiveSchema.parse(params)
}

export function parseBuyParamsPrimitives(paramss: BuyParamsPrimitive[]): BuyParamsPrimitive[] {
  return BuyParamsPrimitivesSchema.parse(paramss)
}

export function parseBuyParamsPrimitiveUid(paramsUid: BuyParamsPrimitiveUid): BuyParamsPrimitiveUid {
  return BuyParamsPrimitiveUidSchema.parse(paramsUid)
}

export const isEqualBuyParamsPrimitive = isEqualByDC(parseBuyParamsPrimitiveUid)
