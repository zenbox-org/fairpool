import { getFinder, getInserter, getName } from 'libs/utils/zod'
import { ContributorScope, ContributorScopeSchema, parseContributorScopeUid } from '../models/ContributorScope'

export const allContributorScopes: ContributorScope[] = []

export const addContributorScope = getInserter(getName(ContributorScopeSchema), ContributorScopeSchema, parseContributorScopeUid, allContributorScopes)

export const findContributorScope = getFinder(parseContributorScopeUid, allContributorScopes)

export const Contract = addContributorScope({
  id: 'Contract',
  notes: `
    * Receives the fees when any user sells
    * Splits the fees with the user-scoped contributor
  `,
})

export const User = addContributorScope({
  id: 'User',
  notes: `
    * Receives the fees when a specific user sells
    * Splits the fees with the user
  `,
})
