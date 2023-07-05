import { ensure } from 'libs/utils/ensure'
import { fromStringToId } from '../../../generic/models/Id'

export function spreadName(firstName?: string, lastName?: string, shortname?: string, uid?: string) {
  const $name = (firstName || lastName) ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : undefined
  const $shortname = shortname || firstName
  const $id = fromStringToId(ensure(uid || $name || shortname, new Error('Person.uid is required')))
  return {
    id: $id,
    name: $name,
    shortname: $shortname,
  }
}
