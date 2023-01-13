import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { BuyParamsSchema } from './BuyParams'

export const BuyFormValuesSchema = BuyParamsSchema.extend({
  quoteDeltaProposed: z.string().min(1, 'Must not be empty'),
  baseDeltaMin: z.string().min(1, 'Must not be empty'),
  deadline: z.string().min(1, 'Must not be empty'),
}).describe('BuyFormValues')

export const BuyFormValuesUidSchema = BuyFormValuesSchema.pick({

})

export const BuyFormValuesArraySchema = getArraySchema(BuyFormValuesSchema, parseBuyFormValuesUid)

export type BuyFormValues = z.infer<typeof BuyFormValuesSchema>

export type BuyFormValuesUid = z.infer<typeof BuyFormValuesUidSchema>

export function parseBuyFormValues(params: BuyFormValues): BuyFormValues {
  return BuyFormValuesSchema.parse(params)
}

export function parseBuyFormValuesArray(paramsArray: BuyFormValues[]): BuyFormValues[] {
  return BuyFormValuesArraySchema.parse(paramsArray)
}

export function parseBuyFormValuesUid(paramsUid: BuyFormValuesUid): BuyFormValuesUid {
  return BuyFormValuesUidSchema.parse(paramsUid)
}

export const safeParseBuyFormValues = BuyFormValuesSchema.safeParse.bind(BuyFormValuesSchema)

export const isEqualBuyFormValues = isEqualByDC(parseBuyFormValuesUid)
