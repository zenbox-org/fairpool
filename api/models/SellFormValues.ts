import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { SellParamsSchema } from './SellParams'
import { StringBigNumSchema } from '../../../ethereum/models/StringBigNum'

export const SellFormValuesSchema = SellParamsSchema.extend({
  baseDeltaProposed: StringBigNumSchema,
  quoteDeltaMin: StringBigNumSchema,
  deadline: StringBigNumSchema,
}).describe('SellFormValues')

export const SellFormValuesUidSchema = SellFormValuesSchema.pick({

})

export const SellFormValuesArraySchema = getArraySchema(SellFormValuesSchema, parseSellFormValuesUid)

export type SellFormValues = z.infer<typeof SellFormValuesSchema>

export type SellFormValuesUid = z.infer<typeof SellFormValuesUidSchema>

export function parseSellFormValues(params: SellFormValues): SellFormValues {
  return SellFormValuesSchema.parse(params)
}

export function parseSellFormValuesArray(paramsArray: SellFormValues[]): SellFormValues[] {
  return SellFormValuesArraySchema.parse(paramsArray)
}

export function parseSellFormValuesUid(paramsUid: SellFormValuesUid): SellFormValuesUid {
  return SellFormValuesUidSchema.parse(paramsUid)
}

export const safeParseSellFormValues = SellFormValuesSchema.safeParse.bind(SellFormValuesSchema)

export const isEqualSellFormValues = isEqualByDC(parseSellFormValuesUid)
