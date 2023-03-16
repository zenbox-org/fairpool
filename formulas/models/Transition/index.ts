import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { ActionSchema } from '../Action'
import { StateSchema } from '../State'

export const TransitionSchema = z.object({
  action: ActionSchema,
  prev: StateSchema,
  next: StateSchema,
}).describe('Transition')

export const TransitionUidSchema = TransitionSchema.pick({

})

export const TransitionsSchema = getArraySchema(TransitionSchema, parseTransitionUid)

export type Transition = z.infer<typeof TransitionSchema>

export type TransitionUid = z.infer<typeof TransitionUidSchema>

export function parseTransition(transition: Transition): Transition {
  return TransitionSchema.parse(transition)
}

export function parseTransitions(transitions: Transition[]): Transition[] {
  return TransitionsSchema.parse(transitions)
}

export function parseTransitionUid(transitionUid: TransitionUid): TransitionUid {
  return TransitionUidSchema.parse(transitionUid)
}

export const isEqualTransition = isEqualByDC(parseTransitionUid)
