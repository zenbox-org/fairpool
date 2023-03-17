import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { z } from 'zod'
import { GetTalliesDeltasFromHoldersConfig, GetTalliesDeltasFromHoldersConfigSchema } from './GetTalliesDeltasFromHoldersConfig'
import { GetTalliesDeltasFromRecipientConfig, GetTalliesDeltasFromRecipientConfigSchema } from './GetTalliesDeltasFromRecipientConfig'
import { GetTalliesDeltasFromReferralsConfigSchema } from './GetTalliesDeltasFromReferralsConfig'
import { GetTalliesDeltasFromSenderConfigSchema } from './GetTalliesDeltasFromSenderConfig'

export const GetTalliesDeltaConfigSchema = z.discriminatedUnion('type', [
  GetTalliesDeltasFromSenderConfigSchema,
  GetTalliesDeltasFromHoldersConfigSchema,
  GetTalliesDeltasFromReferralsConfigSchema,
  GetTalliesDeltasFromRecipientConfigSchema,
]).describe('GetTalliesDeltaConfig')

export const GetTalliesDeltaConfigsSchema = getArraySchema(GetTalliesDeltaConfigSchema, identity)

export type GetTalliesDeltaConfig = z.infer<typeof GetTalliesDeltaConfigSchema>

export const parseGetTalliesDeltaConfig = (config: GetTalliesDeltaConfig): GetTalliesDeltaConfig => GetTalliesDeltaConfigSchema.parse(config)

export const parseGetTalliesDeltaConfigs = (configs: GetTalliesDeltaConfig[]): GetTalliesDeltaConfig[] => GetTalliesDeltaConfigsSchema.parse(configs)

export const isEqualGetTalliesDeltaConfig = isEqualSC

export const getTalliesDeltaConfigTypes: GetTalliesDeltaConfig['type'][] = [
  'GetTalliesDeltasFromSenderConfig',
  'GetTalliesDeltasFromHoldersConfig',
  'GetTalliesDeltasFromRecipientConfig',
  'GetTalliesDeltasFromHoldersConfig',
]
