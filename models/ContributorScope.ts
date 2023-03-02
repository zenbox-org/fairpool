import { IdSchema } from 'libs/generic/models/Id'
import { NotesSchema } from 'libs/generic/models/Notes'
import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'

export const ContributorScopeSchema = z.object({
  id: IdSchema,
  notes: NotesSchema,
}).describe('ContributionScope')

export const ContributorScopesSchema = getArraySchema(ContributorScopeSchema, parseContributorScopeUid)

export const ContributorScopeUidSchema = ContributorScopeSchema.pick({
  id: true,
})

export type ContributorScope = z.infer<typeof ContributorScopeSchema>

export type ContributorScopeUid = z.infer<typeof ContributorScopeUidSchema>

export function parseContributorScope(scope: ContributorScope): ContributorScope {
  return ContributorScopeSchema.parse(scope)
}

export function parseContributorScopes(scopes: ContributorScope[]): ContributorScope[] {
  return ContributorScopesSchema.parse(scopes)
}

export function parseContributorScopeUid(scopeUid: ContributorScopeUid): ContributorScopeUid {
  return ContributorScopeUidSchema.parse(scopeUid)
}

export const isEqualContributorScope = isEqualByDC(parseContributorScopeUid)
