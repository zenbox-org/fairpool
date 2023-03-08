import { z, ZodNumber } from 'zod'
import { ZodRawShape, ZodTypeAny } from 'zod/lib/types'
import { UnknownKeysParam, ZodObjectStd } from '../utils/zod/types'
import { isError } from './api/models/Error'
import { ErrorPageSchema } from './api/models/ErrorPage'
import { parseState, State } from './api/models/State'

// <Output, Def extends ZodTypeDef = ZodTypeDef, Input = Output>(ParamsSchema: ZodType<Output, Def, Input>) => (getNewState: (params: z.infer<typeof ParamsSchema>)

export const toFairpoolTransition = <T extends ZodRawShape & { sessionId: ZodNumber }, UnknownKeys extends UnknownKeysParam = 'strip', Catchall extends ZodTypeAny = ZodTypeAny>(ParamsSchema: ZodObjectStd<T, UnknownKeys, Catchall>) => (getNewState: (params: z.infer<typeof ParamsSchema>) => (state: State) => Promise<State>) => {
  // NOTE: clone(state) must be called in runTransitions
  return ($params: z.infer<typeof ParamsSchema>) => async (state: State): Promise<State> => {
    const paramsParsed = ParamsSchema.parse($params)
    try {
      const $state = await getNewState(paramsParsed)(state)
      return parseState($state)
    } catch (error) {
      // error handling via try-catch is required because we don't want to check for error return values (and we don't have monads)
      if (isError(error)) {
        const { sessionId } = paramsParsed as WithSessionId // NOTE: Not sure how to write that correctly with TypeScript
        state.sessions[sessionId].page = ErrorPageSchema.parse({ error })
        return parseState(state)
      } else {
        throw error
      }
    }
  }
}

type WithSessionId = {
  sessionId: number
}
