import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { AmountUint256BNSchema } from '../../../ethereum/models/AmountUint256BN'
import { AmountPositiveUint256BNSchema } from '../../../ethereum/models/AmountPositiveUint256BN'
import { DeadlineSchema } from '../../../ethereum/models/Deadline'

export const SellParamsSchema = z.object({
  baseDeltaProposed: AmountPositiveUint256BNSchema,
  quoteDeltaMin: AmountUint256BNSchema,
  deadline: DeadlineSchema,
}).describe('SellParams')

export const SellParamsUidSchema = SellParamsSchema

export const SellParamsArraySchema = getArraySchema(SellParamsSchema, parseSellParamsUid)

export type SellParams = z.infer<typeof SellParamsSchema>

export type SellParamsUid = z.infer<typeof SellParamsUidSchema>

export function parseSellParams(params: SellParams): SellParams {
  return SellParamsSchema.parse(params)
}

export function parseSellParamsArray(paramss: SellParams[]): SellParams[] {
  return SellParamsArraySchema.parse(paramss)
}

export function parseSellParamsUid(paramsUid: SellParamsUid): SellParamsUid {
  return SellParamsUidSchema.parse(paramsUid)
}

export const safeParseSellParams = SellParamsSchema.safeParse.bind(SellParamsSchema)

export const isEqualSellParams = isEqualByDC(parseSellParamsUid)
