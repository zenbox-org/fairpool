import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualSC } from 'libs/utils/lodash'
import { identity } from 'remeda'

export const AmountDeltaSchema = z.enum([]).describe('AmountDelta')

export const AmountDeltasSchema = getArraySchema(AmountDeltaSchema, identity)

export type AmountDelta = z.infer<typeof AmountDeltaSchema>

export const parseAmountDelta = (delta: AmountDelta): AmountDelta => AmountDeltaSchema.parse(delta)

export const parseAmountDeltas = (s: AmountDelta[]): AmountDelta[] => AmountDeltasSchema.parse(s)

export const isEqualAmountDelta = isEqualSC
