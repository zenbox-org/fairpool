import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { literal, z } from 'zod'

export const GetTalliesDeltasFromHoldersConfigSchema = z.object({
  type: literal('GetTalliesDeltasFromHoldersConfig'),
}).describe('GetTalliesDeltasFromHoldersConfig')

export const GetTalliesDeltasFromHoldersConfigsSchema = getArraySchema(GetTalliesDeltasFromHoldersConfigSchema, identity)

export type GetTalliesDeltasFromHoldersConfig = z.infer<typeof GetTalliesDeltasFromHoldersConfigSchema>

export const parseGetTalliesDeltasFromHoldersConfig = (config: GetTalliesDeltasFromHoldersConfig): GetTalliesDeltasFromHoldersConfig => GetTalliesDeltasFromHoldersConfigSchema.parse(config)

export const parseGetTalliesDeltasFromHoldersConfigs = (s: GetTalliesDeltasFromHoldersConfig[]): GetTalliesDeltasFromHoldersConfig[] => GetTalliesDeltasFromHoldersConfigsSchema.parse(s)

export const isEqualGetTalliesDeltasFromHoldersConfig = isEqualSC
