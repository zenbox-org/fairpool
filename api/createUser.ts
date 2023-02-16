import { z } from 'zod'
import { TransitionP } from '../../divide-and-conquer/TransitionP'
import { State } from './models/State'

export const CreateUserSchema = z.object({}).describe('CreateUser')

export type CreateUser = z.infer<typeof CreateUserSchema>

export const createUser: TransitionP<CreateUser, State> = () => async (state) => {
  state.users.push({})
  return state
}
