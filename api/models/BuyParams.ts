import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { AmountUint256BNSchema } from '../../../ethereum/models/AmountUint256BN'
import { AmountPositiveUint256BNSchema } from '../../../ethereum/models/AmountPositiveUint256BN'
import { DeadlineSchema } from '../../../ethereum/models/Deadline'

export const BuyParamsSchema = z.object({
  quoteDeltaProposed: AmountPositiveUint256BNSchema,
  baseDeltaMin: AmountUint256BNSchema,
  deadline: DeadlineSchema,
}).describe('BuyParams')

export const BuyParamsUidSchema = BuyParamsSchema

export const BuyParamssSchema = getArraySchema(BuyParamsSchema, parseBuyParamsUid)

export type BuyParams = z.infer<typeof BuyParamsSchema>

export type BuyParamsUid = z.infer<typeof BuyParamsUidSchema>

export function parseBuyParams(params: BuyParams): BuyParams {
  return BuyParamsSchema.parse(params)
}

export function parseBuyParamss(paramss: BuyParams[]): BuyParams[] {
  return BuyParamssSchema.parse(paramss)
}

export function parseBuyParamsUid(paramsUid: BuyParamsUid): BuyParamsUid {
  return BuyParamsUidSchema.parse(paramsUid)
}

export const safeParseBuyParams = BuyParamsSchema.safeParse.bind(BuyParamsSchema)

export const isEqualBuyParams = isEqualByDC(parseBuyParamsUid)
