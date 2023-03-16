import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { NaturalNumberSchema } from '../../../../../../generic/models/NaturalNumber'
import { NumeratorSchema } from '../../../Share/Numerator'
import { BaseActionSchema } from '../index'

export const BaseSetShareNumeratorSchema = BaseActionSchema.extend({
  index: NaturalNumberSchema,
  numerator: NumeratorSchema,
}).describe('SetShareNumerator')

export const SetShareNumeratorSchema = BaseSetShareNumeratorSchema.extend({
  type: z.literal('setShareNumerator'),
})

export const SetShareNumeratorUidSchema = SetShareNumeratorSchema

export const SetShareNumeratorsSchema = getArraySchema(SetShareNumeratorSchema, parseSetShareNumeratorUid)

export type SetShareNumerator = z.infer<typeof SetShareNumeratorSchema>

export type SetShareNumeratorUid = z.infer<typeof SetShareNumeratorUidSchema>

export function parseSetShareNumerator(action: SetShareNumerator): SetShareNumerator {
  return SetShareNumeratorSchema.parse(action)
}

export function parseSetShareNumerators(actions: SetShareNumerator[]): SetShareNumerator[] {
  return SetShareNumeratorsSchema.parse(actions)
}

export function parseSetShareNumeratorUid(actionUid: SetShareNumeratorUid): SetShareNumeratorUid {
  return SetShareNumeratorUidSchema.parse(actionUid)
}

export const isEqualSetShareNumerator = isEqualByDC(parseSetShareNumeratorUid)
