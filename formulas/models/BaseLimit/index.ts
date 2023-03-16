import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { z } from 'zod'
import { Uint256BigIntSchema } from '../../../../ethereum/models/Uint256BigInt'
import { baseLimitMax, baseLimitMin } from './constants'

export const BaseLimitSchema = Uint256BigIntSchema.min(baseLimitMin).max(baseLimitMax).describe('BaseLimit')

export const BaseLimitsSchema = getArraySchema(BaseLimitSchema, identity)

export type BaseLimit = z.infer<typeof BaseLimitSchema>

export const parseBaseLimit = (baseLimit: BaseLimit): BaseLimit => BaseLimitSchema.parse(baseLimit)

export const parseBaseLimits = (baseLimits: BaseLimit[]): BaseLimit[] => BaseLimitsSchema.parse(baseLimits)

export const isEqualBaseLimit = isEqualSC
