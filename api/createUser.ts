import { z } from 'zod'
import { Transition } from '../../divide-and-conquer/Transition'
import { State } from './models/State'

export const CreateUserSchema = z.object({}).describe('CreateUser')

export type CreateUser = z.infer<typeof CreateUserSchema>

export const createUser: Transition<CreateUser, State> = () => async (state) => {
  state.users.push({})
  return state
}
