import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { StateSchema } from '../../../api/models/State'
import { ActionSchema } from '../Action'

export const TransitionSchema = z.object({
  prev: StateSchema,
  next: StateSchema,
  action: ActionSchema,
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
