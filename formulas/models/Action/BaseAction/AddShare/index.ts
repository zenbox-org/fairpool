import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { ShareValuesSchema } from '../../../Share/ShareValues'
import { BaseActionSchema } from '../index'

export const BaseAddShareSchema = BaseActionSchema.merge(ShareValuesSchema)
  .describe('AddShare')

export const AddShareSchema = BaseAddShareSchema.extend({
  type: z.literal('addShare'),
})

export const AddShareUidSchema = AddShareSchema

export const AddSharesSchema = getArraySchema(AddShareSchema, parseAddShareUid)

export type AddShare = z.infer<typeof AddShareSchema>

export type AddShareUid = z.infer<typeof AddShareUidSchema>

export function parseAddShare(addShare: AddShare): AddShare {
  return AddShareSchema.parse(addShare)
}

export function parseAddShares(addShares: AddShare[]): AddShare[] {
  return AddSharesSchema.parse(addShares)
}

export function parseAddShareUid(addShareUid: AddShareUid): AddShareUid {
  return AddShareUidSchema.parse(addShareUid)
}

export const isEqualAddShare = isEqualByDC(parseAddShareUid)
