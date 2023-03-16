import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { Uint256BigIntSchema } from '../../../../ethereum/models/Uint256BigInt'
import { scaleFixed } from '../Fairpool/constants'

export const DistributionParamsSchema = z.object({
  royalties: Uint256BigIntSchema,
  earnings: Uint256BigIntSchema,
  fees: Uint256BigIntSchema,
})
  .refine(({ royalties, earnings, fees }) => royalties + earnings + fees <= scaleFixed, 'assert(royalties + earnings + fees <= scaleFixed)')
  .describe('DistributionParams')

export const DistributionParamsUidSchema = DistributionParamsSchema

export const DistributionParamsArraySchema = getArraySchema(DistributionParamsSchema, parseDistributionParamsUid)

export type DistributionParams = z.infer<typeof DistributionParamsSchema>

export type DistributionParamsUid = z.infer<typeof DistributionParamsUidSchema>

export function parseDistributionParams(params: DistributionParams): DistributionParams {
  return DistributionParamsSchema.parse(params)
}

export function parseDistributionParamsArray(array: DistributionParams[]): DistributionParams[] {
  return DistributionParamsArraySchema.parse(array)
}

export function parseDistributionParamsUid(paramsUid: DistributionParamsUid): DistributionParamsUid {
  return DistributionParamsUidSchema.parse(paramsUid)
}

export const isEqualDistributionParams = isEqualByDC(parseDistributionParamsUid)
