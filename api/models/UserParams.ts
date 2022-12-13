import { z } from 'zod'
import { IdxSchema } from '../../../generic/models/Idx'

export const UserParamsSchema = z.object({
  userId: IdxSchema,
}).describe('UserParams')

export type UserParams = z.infer<typeof UserParamsSchema>

export function parseUserParams(params: UserParams): UserParams {
  return UserParamsSchema.parse(params)
}
