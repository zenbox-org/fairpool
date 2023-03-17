import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { literal, z } from 'zod'

export const GetTalliesDeltasFromSenderConfigSchema = z.object({
  type: literal('GetTalliesDeltasFromSenderConfig'),
}).describe('GetTalliesDeltasFromSenderConfig')

export const GetTalliesDeltasFromSenderConfigsSchema = getArraySchema(GetTalliesDeltasFromSenderConfigSchema, identity)

export type GetTalliesDeltasFromSenderConfig = z.infer<typeof GetTalliesDeltasFromSenderConfigSchema>

export const parseGetTalliesDeltasFromSenderConfig = (config: GetTalliesDeltasFromSenderConfig): GetTalliesDeltasFromSenderConfig => GetTalliesDeltasFromSenderConfigSchema.parse(config)

export const parseGetTalliesDeltasFromSenderConfigs = (s: GetTalliesDeltasFromSenderConfig[]): GetTalliesDeltasFromSenderConfig[] => GetTalliesDeltasFromSenderConfigsSchema.parse(s)

export const isEqualGetTalliesDeltasFromSenderConfig = isEqualSC
