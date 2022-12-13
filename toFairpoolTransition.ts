import { clone } from 'remeda'
import { z } from 'zod'
import { ZodRawShape, ZodTypeAny } from 'zod/lib/types'
import { UnknownKeysParam, ZodObjectStd } from '../utils/zod/types'
import { isError } from './api/models/Error'
import { ErrorPageSchema } from './api/models/ErrorPage'
import { State, StateSchema } from './api/models/State'

// <Output, Def extends ZodTypeDef = ZodTypeDef, Input = Output>(ParamsSchema: ZodType<Output, Def, Input>) => (getNewState: (params: z.infer<typeof ParamsSchema>)

export const toFairpoolTransition = <T extends ZodRawShape, UnknownKeys extends UnknownKeysParam = 'strip', Catchall extends ZodTypeAny = ZodTypeAny>(ParamsSchema: ZodObjectStd<T, UnknownKeys, Catchall>) => (getNewState: (params: z.infer<typeof ParamsSchema>) => (state: State) => Promise<State>) => {
  return ($params: z.infer<typeof ParamsSchema>) => async (state: State): Promise<State> => {
    const paramsParsed = ParamsSchema.parse($params)
    const stateOld = clone(state)
    try {
      // clone is required because the update function may mutate the argument
      const stateNew = await getNewState(paramsParsed)(stateOld)
      return StateSchema.parse(stateNew)
    } catch (error) {
      // error handling via try-catch is required because we don't want to check for error return values (and we don't have monads)
      if (isError(error)) {
        const { sessionId } = paramsParsed as WithSessionId // NOTE: Not sure how to write that correctly with TypeScript
        stateOld.sessions[sessionId].page = ErrorPageSchema.parse({ error })
        return StateSchema.parse(stateOld)
      } else {
        throw error
      }
    }
  }
}

type WithSessionId = {
  sessionId: number
}
