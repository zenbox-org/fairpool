import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { boolean, literal, record, z } from 'zod'
import { QuotientBigNatSchema } from '../../../../../utils/Quotient/QuotientBigNat'
import { AddressSchema } from '../../Address'

export const GetTalliesDeltasFromReferralsConfigSchema = z.object({
  type: literal('GetTalliesDeltasFromReferralsConfig'),
  discount: QuotientBigNatSchema,
  referralsMap: record(AddressSchema, AddressSchema),
  isRecognizedReferralMap: record(AddressSchema, boolean()),
}).describe('GetTalliesDeltasFromReferralsConfig')

export const GetTalliesDeltasFromReferralsConfigsSchema = getArraySchema(GetTalliesDeltasFromReferralsConfigSchema, identity)

export type GetTalliesDeltasFromReferralsConfig = z.infer<typeof GetTalliesDeltasFromReferralsConfigSchema>

export const parseGetTalliesDeltasFromReferralsConfig = (config: GetTalliesDeltasFromReferralsConfig): GetTalliesDeltasFromReferralsConfig => GetTalliesDeltasFromReferralsConfigSchema.parse(config)

export const parseGetTalliesDeltasFromReferralsConfigs = (s: GetTalliesDeltasFromReferralsConfig[]): GetTalliesDeltasFromReferralsConfig[] => GetTalliesDeltasFromReferralsConfigsSchema.parse(s)

export const isEqualGetTalliesDeltasFromReferralsConfig = isEqualSC
