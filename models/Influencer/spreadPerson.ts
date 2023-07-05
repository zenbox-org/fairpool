import { Person } from '../Person'

export function spreadPerson(person: Person) {
  return { id: person.id, person }
}
