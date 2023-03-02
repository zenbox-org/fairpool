import { IdSchema } from 'libs/generic/models/Id'
import { NotesSchema } from 'libs/generic/models/Notes'
import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'

export const ContributorGroupSchema = z.object({
  id: IdSchema,
  notes: NotesSchema,
}).describe('Group')

export const ContributorGroupsSchema = getArraySchema(ContributorGroupSchema, parseContributorGroupUid)

export const ContributorGroupUidSchema = ContributorGroupSchema.pick({
  id: true,
})

export type ContributorGroup = z.infer<typeof ContributorGroupSchema>

export type ContributorGroupUid = z.infer<typeof ContributorGroupUidSchema>

export function parseContributorGroup(group: ContributorGroup): ContributorGroup {
  return ContributorGroupSchema.parse(group)
}

export function parseContributorGroups(groups: ContributorGroup[]): ContributorGroup[] {
  return ContributorGroupsSchema.parse(groups)
}

export function parseContributorGroupUid(groupUid: ContributorGroupUid): ContributorGroupUid {
  return ContributorGroupUidSchema.parse(groupUid)
}

export const isEqualContributorGroup = isEqualByDC(parseContributorGroupUid)
