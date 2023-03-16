import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'

export const BaseNoopSchema = z.object({

}).describe('Noop')

export const NoopSchema = BaseNoopSchema.extend({
  type: z.literal('noop'),
})

export const NoopUidSchema = NoopSchema.pick({

})

export const NoopsSchema = getArraySchema(NoopSchema, parseNoopUid)

export type Noop = z.infer<typeof NoopSchema>

export type NoopUid = z.infer<typeof NoopUidSchema>

export function parseNoop(noop: Noop): Noop {
  return NoopSchema.parse(noop)
}

export function parseNoops(noops: Noop[]): Noop[] {
  return NoopsSchema.parse(noops)
}

export function parseNoopUid(noopUid: NoopUid): NoopUid {
  return NoopUidSchema.parse(noopUid)
}

export const isEqualNoop = isEqualByDC(parseNoopUid)
