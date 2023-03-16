import { isEqualByDC } from 'libs/utils/lodash'
import { getDuplicatesRefinement, getSchemaDescription } from 'libs/utils/zod'
import { record, z } from 'zod'
import { todo } from '../../../../utils/todo'
import { Action } from '../Action'
import { sharesLengthMax } from '../Fairpool/constants'
import { OwnersSchema } from '../Owner'
import { ShareBoundsSchema } from './ShareBounds'
import { ShareExposedFieldSchema } from './ShareExposedField'
import { ShareValuesSchema } from './ShareValues'

export const ShareSchema = ShareValuesSchema.merge(ShareBoundsSchema).extend({
  permissions: record(ShareExposedFieldSchema, OwnersSchema),
})
  .describe('Share')

export const ShareUidSchema = ShareSchema.pick({
  name: true,
})

export const SharesSchema = ShareSchema.array()
  .max(sharesLengthMax)
  .superRefine(getDuplicatesRefinement(getSchemaDescription(ShareSchema), parseShareUid))
  .superRefine((shares, ctx) => {
    shares.forEach((share, index) => {
      return todo(undefined, 'Ensure no cycles in share.parent')
    })
    if (shares.length) {
      todo(undefined, 'Ensure numerators sum lte scaleFixed for each children array')
      todo(undefined, 'Apply all bounds')
    }
  })

export const validateShareUpdate = (action: Action, prev: Share, next: Share) => {

}

export type ShareUid = z.infer<typeof ShareUidSchema>

export type Share = z.infer<typeof ShareSchema>

export function parseShare(share: Share): Share {
  return ShareSchema.parse(share)
}

export function parseShares(shares: Share[]): Share[] {
  return SharesSchema.parse(shares)
}

export function parseShareUid(shareUid: ShareUid): ShareUid {
  return ShareUidSchema.parse(shareUid)
}

export const isEqualShare = isEqualByDC(parseShareUid)

export type ShareKey = keyof Share
