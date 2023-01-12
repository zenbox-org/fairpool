import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { BuyParamsSchema } from './BuyParams'

export const BuyParamsFormSchema = BuyParamsSchema.extend({
  quoteDeltaProposed: z.string().min(1, 'Must not be empty'),
  baseDeltaMin: z.string().min(1, 'Must not be empty'),
  deadline: z.string().min(1, 'Must not be empty'),
}).describe('BuyParamsForm')

export const BuyParamsFormUidSchema = BuyParamsFormSchema.pick({

})

export const BuyParamsFormsSchema = getArraySchema(BuyParamsFormSchema, parseBuyParamsFormUid)

export type BuyParamsForm = z.infer<typeof BuyParamsFormSchema>

export type BuyParamsFormUid = z.infer<typeof BuyParamsFormUidSchema>

export function parseBuyParamsForm(params: BuyParamsForm): BuyParamsForm {
  return BuyParamsFormSchema.parse(params)
}

export function parseBuyParamsForms(paramss: BuyParamsForm[]): BuyParamsForm[] {
  return BuyParamsFormsSchema.parse(paramss)
}

export function parseBuyParamsFormUid(paramsUid: BuyParamsFormUid): BuyParamsFormUid {
  return BuyParamsFormUidSchema.parse(paramsUid)
}

export const safeParseBuyParamsForm = BuyParamsFormSchema.safeParse.bind(BuyParamsFormSchema)

export const isEqualBuyParamsForm = isEqualByDC(parseBuyParamsFormUid)
