import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { BuyParamsSchema } from './BuyParams'
import { StringBigNumSchema } from '../../../ethereum/models/StringBigNum'

export const BuyFormValuesSchema = BuyParamsSchema.extend({
  quoteDeltaProposed: StringBigNumSchema,
  baseDeltaMin: StringBigNumSchema,
  deadline: StringBigNumSchema,
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
