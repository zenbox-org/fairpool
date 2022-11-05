import { z } from 'zod'
import * as $ from '../../generic/models/Person'
import { getDuplicatesRefinement } from 'zenbox-util/zod'
import { NameSchema } from '../../generic/models/Name'
import { LanguageSchema } from '../../generic/models/Language'
import { NotesSchema } from '../../generic/models/Notes'

export const PersonSchema = $.PersonSchema.extend({
  name: $.PersonSchema.shape.name.optional(), // we can't get the names of some influencers
  nickname: NameSchema.optional(),
  language: LanguageSchema,
  notes: NotesSchema,
})

export const PersonsSchema = z.array(PersonSchema)
  .superRefine(getDuplicatesRefinement('Person', parsePersonUid))

export const PersonUidSchema = PersonSchema.pick({
  uid: true,
})

export type Person = z.infer<typeof PersonSchema>

export type PersonUid = z.infer<typeof PersonUidSchema>

export function parsePerson(person: Person): Person {
  return PersonSchema.parse(person)
}

export function parsePersons(persons: Person[]): Person[] {
  return PersonsSchema.parse(persons)
}

export function parsePersonUid(personUid: PersonUid): PersonUid {
  return PersonUidSchema.parse(personUid)
}
