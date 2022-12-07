import { IdSchema } from 'libs/generic/models/Id'
import { isEqualByD } from 'zenbox-util/lodash'
import { getDuplicatesRefinement } from 'zenbox-util/zod'
import { z } from 'zod'

export interface InfluencerTag {
  id: string
  parent?: InfluencerTag
}

export const InfluencerTagSchema: z.ZodSchema<InfluencerTag> = z.lazy(() => z.object({
  id: IdSchema,
  parent: InfluencerTagSchema.optional(),
})).describe('InfluencerTag')

export const InfluencerTagsSchema = z.array(InfluencerTagSchema)
  .superRefine(getDuplicatesRefinement('InfluencerTag', parseInfluencerTagUid))

export const InfluencerTagUidSchema = z.object({
  id: IdSchema,
})

export type InfluencerTagUid = z.infer<typeof InfluencerTagUidSchema>

export function parseInfluencerTag(tag: InfluencerTag): InfluencerTag {
  return InfluencerTagSchema.parse(tag)
}

export function parseInfluencerTags(tags: InfluencerTag[]): InfluencerTag[] {
  return InfluencerTagsSchema.parse(tags)
}

export function parseInfluencerTagUid(tagUid: InfluencerTagUid): InfluencerTagUid {
  return InfluencerTagUidSchema.parse(tagUid)
}

export const isEqualInfluencerTag = (a: InfluencerTag) => (b: InfluencerTag) => isEqualByD(a, b, parseInfluencerTagUid)
