import { z } from 'zod'
import { TransitionP } from '../../divide-and-conquer/TransitionP'
import { State } from './models/State'
import { UserParamsSchema } from './models/UserParams'

export const CreateSessionSchema = UserParamsSchema.describe('CreateSession')

export type CreateSession = z.infer<typeof CreateSessionSchema>

export const createSession: TransitionP<CreateSession, State> = ({ userId }) => async (state) => {
  state.sessions.push({
    userId,
    page: { type: 'Home' },
  })
  return state
}
