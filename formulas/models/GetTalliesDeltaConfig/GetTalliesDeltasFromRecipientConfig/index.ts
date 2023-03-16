import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { literal, z } from 'zod'
import { AddressSchema } from '../../Address'

export const GetTalliesDeltasFromRecipientConfigSchema = z.object({
  type: literal('GetTalliesDeltasFromRecipientConfig'),
  address: AddressSchema,
}).describe('GetTalliesDeltasFromRecipientConfig')

export const GetTalliesDeltasFromRecipientConfigsSchema = getArraySchema(GetTalliesDeltasFromRecipientConfigSchema, identity)

export type GetTalliesDeltasFromRecipientConfig = z.infer<typeof GetTalliesDeltasFromRecipientConfigSchema>

export const parseGetTalliesDeltasFromRecipientConfig = (config: GetTalliesDeltasFromRecipientConfig): GetTalliesDeltasFromRecipientConfig => GetTalliesDeltasFromRecipientConfigSchema.parse(config)

export const parseGetTalliesDeltasFromRecipientConfigs = (s: GetTalliesDeltasFromRecipientConfig[]): GetTalliesDeltasFromRecipientConfig[] => GetTalliesDeltasFromRecipientConfigsSchema.parse(s)

export const isEqualGetTalliesDeltasFromRecipientConfig = isEqualSC
