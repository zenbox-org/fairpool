import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'

export const UserSchema = z.object({

}).describe('User')

export const UsersSchema = getArraySchema(UserSchema, parseUserUid)

export const UserUidSchema = UserSchema

export type User = z.infer<typeof UserSchema>

export type UserUid = z.infer<typeof UserUidSchema>

export function parseUser(user: User): User {
  return UserSchema.parse(user)
}

export function parseUsers(users: User[]): User[] {
  return UsersSchema.parse(users)
}

export function parseUserUid(userUid: UserUid): UserUid {
  return UserUidSchema.parse(userUid)
}

export const isEqualUser = isEqualByDC(parseUserUid)
