import { Language } from '../../../generic/models/Language'
import { Optional } from 'ts-toolbelt/out/Object/Optional'
import { parsePerson, Person } from '../Person'
import { Mapper } from 'zenbox-util/lodash'
import { Contact } from '../../../generic/models/Contact'

export const mapPersonFL = <T>(map: Mapper<Person, T>) => (firstname: string, lastname: string, nickname = firstname, language: Language, contacts: Contact[] = [], person: Optional<Person, 'uid' | 'name' | 'nickname' | 'language' | 'contacts'> = {}) => map({
  uid: `${firstname}${lastname}`,
  name: firstname + ' ' + lastname,
  nickname,
  language,
  contacts,
  ...person,
})

export const mapPersonN = <T>(map: Mapper<Person, T>) => (nickname: string, language: Language, contacts: Contact[] = [], person: Optional<Person, 'uid' | 'nickname' | 'language' | 'contacts'> = {}) => map({
  uid: nickname,
  nickname,
  language,
  contacts,
  ...person,
})

export const mapPersonU = <T>(map: Mapper<Person, T>) => (uid: string, language: Language, contacts: Contact[] = [], person: Optional<Person, 'uid' | 'nickname' | 'language' | 'contacts'> = {}) => map({
  uid,
  language,
  contacts,
  ...person,
})

export const parsePersonFL = mapPersonFL(parsePerson)

export const parsePersonN = mapPersonN(parsePerson)

export const parsePersonU = mapPersonU(parsePerson)
