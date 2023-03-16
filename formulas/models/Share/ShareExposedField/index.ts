import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { z } from 'zod'
import { ShareBounds } from '../ShareBounds'
import { ShareValues } from '../ShareValues'

type Field = keyof ShareValues | keyof ShareBounds

const strings: Readonly<[Field, ...Field[]]> = [
  'numerator',
  'numeratorMin',
  'numeratorMax',
  'childrenLengthMin',
  'childrenLengthMax',
  'childrenNumeratorsSumMin',
  'childrenNumeratorsSumMax',
] as const

export const ShareExposedFieldSchema = z.enum(strings).describe('ShareExposedField')

export const ShareExposedFieldsSchema = getArraySchema(ShareExposedFieldSchema, identity)

export type ShareExposedField = z.infer<typeof ShareExposedFieldSchema>

export const parseShareExposedField = (field: ShareExposedField): ShareExposedField => ShareExposedFieldSchema.parse(field)

export const parseShareExposedFields = (fields: ShareExposedField[]): ShareExposedField[] => ShareExposedFieldsSchema.parse(fields)

export const isEqualShareExposedField = isEqualSC
