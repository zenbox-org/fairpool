import { z } from 'zod'
import { Transition } from '../../divide-and-conquer/Transition'
import { parseState, State } from './models/State'
import { UserParamsSchema } from './models/UserParams'

export const CreateSessionSchema = UserParamsSchema.describe('CreateSession')

export type CreateSession = z.infer<typeof CreateSessionSchema>

export const createSession: Transition<CreateSession, State> = ({ userId }) => async (state) => {
  state.sessions.push({
    userId,
    page: { type: 'Home' },
  })
  return parseState(state)
}
