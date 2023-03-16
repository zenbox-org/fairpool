import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { bigint, RefinementCtx, z } from 'zod'
import { refineR } from '../../../../utils/bigint/BigIntAllRefinesR'
import { baseLimitMax, baseLimitMin } from '../BaseLimit/constants'
import { quoteOffsetMax, quoteOffsetMin } from '../QuoteOffset/constants'

export const RawPriceParamsSchema = z.object({
  baseLimit: bigint().min(baseLimitMin).max(baseLimitMax),
  quoteOffset: bigint().min(quoteOffsetMin).max(quoteOffsetMax),
})

export const RawPriceParamsSuperRefine = ({ baseLimit, quoteOffset }: RawPriceParams, ctx: RefinementCtx) => {
  refineR.lte(ctx)(baseLimit, quoteOffset, 'baseLimit', 'quoteOffset', {}, 'Required for gte(quoteDelta, baseDelta) to avoid the issues with integer arithmetic')
}

export type RawPriceParams = z.infer<typeof RawPriceParamsSchema>

export const PriceParamsSchema = RawPriceParamsSchema.superRefine(RawPriceParamsSuperRefine).describe('PriceParams')

export const PriceParamsUidSchema = PriceParamsSchema

export const PriceParamsArraySchema = getArraySchema(PriceParamsSchema, parsePriceParamsUid)

export type PriceParams = z.infer<typeof PriceParamsSchema>

export type PriceParamsUid = z.infer<typeof PriceParamsUidSchema>

export function parsePriceParams(params: PriceParams): PriceParams {
  return PriceParamsSchema.parse(params)
}

export function parsePriceParamsArray(array: PriceParams[]): PriceParams[] {
  return PriceParamsArraySchema.parse(array)
}

export function parsePriceParamsUid(paramsUid: PriceParamsUid): PriceParamsUid {
  return PriceParamsUidSchema.parse(paramsUid)
}

export const isEqualPriceParams = isEqualByDC(parsePriceParamsUid)
