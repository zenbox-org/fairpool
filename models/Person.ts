import { getDuplicatesRefinement } from 'libs/utils/zod'
import { z } from 'zod'
import { LanguageSchema } from '../../generic/models/Language'
import { NameSchema } from '../../generic/models/Name'
import { NotesSchema } from '../../generic/models/Notes'
import * as $ from '../../generic/models/Person'

export const PersonSchema = $.PersonSchema.extend({
  name: $.PersonSchema.shape.name.optional(), // we can't get the names of some influencers
  shortname: NameSchema.optional(),
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
