import { getFinder, getInserter, getName } from 'libs/utils/zod'
import { ContributorGroup, ContributorGroupSchema, parseContributorGroupUid } from '../models/ContributorGroup'

export const allContributorGroups: ContributorGroup[] = []

export const addContributorGroup = getInserter(getName(ContributorGroupSchema), ContributorGroupSchema, parseContributorGroupUid, allContributorGroups)

export const findContributorGroup = getFinder(parseContributorGroupUid, allContributorGroups)

export const Investor = addContributorGroup({
  id: 'Investor',
})

export const Marketer = addContributorGroup({
  id: 'Marketer',
})

export const Developer = addContributorGroup({
  id: 'Developer',
})
