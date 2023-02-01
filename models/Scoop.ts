import { z } from 'zod'
import { getArraySchema, getNonEmptyArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'

export const ScoopSchema = z.object({
  locale: z.string(),
  title: z.string(),
  description: z.string().optional(),
  proposition: z.string().optional(),
}).describe('LocalizedContent')

export const ScoopUidSchema = ScoopSchema.pick({
  locale: true,
})

export const ScoopsSchema = getArraySchema(ScoopSchema, parseScoopUid)

export const NonEmptyScoopsSchema = getNonEmptyArraySchema(ScoopSchema, parseScoopUid)

export type Scoop = z.infer<typeof ScoopSchema>

export type ScoopUid = z.infer<typeof ScoopUidSchema>

export type NonEmptyScoops = z.infer<typeof NonEmptyScoopsSchema>

export function parseScoop(content: Scoop): Scoop {
  return ScoopSchema.parse(content)
}

export function parseScoops(scoops: Scoop[]): Scoop[] {
  return ScoopsSchema.parse(scoops)
}

export function parseNonEmptyScoops(scoops: Scoop[]): NonEmptyScoops {
  return NonEmptyScoopsSchema.parse(scoops)
}

export function parseScoopUid(contentUid: ScoopUid): ScoopUid {
  return ScoopUidSchema.parse(contentUid)
}

export const isEqualScoop = isEqualByDC(parseScoopUid)

export const ZeroScoop = parseScoop({
  locale: 'en',
  title: '',
  description: undefined,
  proposition: '',
})
