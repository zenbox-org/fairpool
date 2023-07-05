import { Optional } from 'ts-toolbelt/out/Object/Optional'
import { Contact } from '../../../generic/models/Contact'
import { Language } from '../../../generic/models/Language'
import { Mapper } from '../../../generic/models/Mapper'
import { parsePerson, Person } from '../Person'

export const mapPersonFL = <T>(map: Mapper<Person, T>) => (firstname: string, lastname: string, shortname = firstname, language: Language, contacts: Contact[] = [], person: Optional<Person, 'id' | 'name' | 'shortname' | 'language' | 'contacts'> = {}) => map({
  id: `${firstname}${lastname}`,
  name: firstname + ' ' + lastname,
  shortname,
  language,
  contacts,
  ...person,
})

export const mapPersonN = <T>(map: Mapper<Person, T>) => (shortname: string, language: Language, contacts: Contact[] = [], person: Optional<Person, 'id' | 'shortname' | 'language' | 'contacts'> = {}) => map({
  id: shortname,
  shortname,
  language,
  contacts,
  ...person,
})

export const mapPersonU = <T>(map: Mapper<Person, T>) => (id: string, language: Language, contacts: Contact[] = [], person: Optional<Person, 'id' | 'shortname' | 'language' | 'contacts'> = {}) => map({
  id,
  language,
  contacts,
  ...person,
})

export const parsePersonFL = mapPersonFL(parsePerson)

export const parsePersonN = mapPersonN(parsePerson)

export const parsePersonU = mapPersonU(parsePerson)
