import { ensure } from 'zenbox-util/ensure'
import { fromStringToId } from '../../../generic/models/Id'

export function spreadName(firstName?: string, lastName?: string, nickname?: string, uid?: string) {
  const $name = (firstName || lastName) ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : undefined
  const $nickname = nickname || firstName
  const $uid = ensure(uid || ($name && fromStringToId($name)) || (nickname && fromStringToId(nickname)), new Error('Person.uid is required'))
  return {
    uid: $uid,
    name: $name,
    nickname: $nickname,
  }
}
