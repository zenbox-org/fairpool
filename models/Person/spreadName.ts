import { ensure } from 'zenbox-util/ensure'
import { fromStringToId } from '../../../generic/models/Id'

export function spreadName(firstName?: string, lastName?: string, shortname?: string, uid?: string) {
  const $name = (firstName || lastName) ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : undefined
  const $shortname = shortname || firstName
  const $uid = ensure(uid || ($name && fromStringToId($name)) || (shortname && fromStringToId(shortname)), new Error('Person.uid is required'))
  return {
    uid: $uid,
    name: $name,
    shortname: $shortname,
  }
}
