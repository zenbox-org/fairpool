import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { z } from 'zod'
import { Uint256BigIntSchema } from '../../../../ethereum/models/Uint256BigInt'
import { baseLimitMax } from '../BaseLimit/constants'

export const BaseDeltaSchema = Uint256BigIntSchema.min(1n).max(baseLimitMax - 1n).describe('BaseDelta')

export const BaseDeltasSchema = getArraySchema(BaseDeltaSchema, identity)

export type BaseDelta = z.infer<typeof BaseDeltaSchema>

export const parseBaseDelta = (baseDelta: BaseDelta): BaseDelta => BaseDeltaSchema.parse(baseDelta)

export const parseBaseDeltas = (baseDeltas: BaseDelta[]): BaseDelta[] => BaseDeltasSchema.parse(baseDeltas)

export const isEqualBaseDelta = isEqualSC
