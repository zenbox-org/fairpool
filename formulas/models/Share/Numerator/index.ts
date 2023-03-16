import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { z } from 'zod'
import { Uint256BigIntSchema } from '../../../../../ethereum/models/Uint256BigInt'
import { scaleFixed } from '../../Fairpool/constants'

export const NumeratorSchema = Uint256BigIntSchema.max(scaleFixed).describe('Numerator')

export const NumeratorsSchema = getArraySchema(NumeratorSchema, identity)

export type Numerator = z.infer<typeof NumeratorSchema>

export const parseNumerator = (numerator: Numerator): Numerator => NumeratorSchema.parse(numerator)

export const parseNumerators = (numerators: Numerator[]): Numerator[] => NumeratorsSchema.parse(numerators)

export const isEqualNumerator = isEqualSC
