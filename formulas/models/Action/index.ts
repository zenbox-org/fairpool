import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { BuySchema } from './Buy'

export const ActionSchema = z.discriminatedUnion('name', [
  BuySchema,
]).describe('Action')

export const ActionUidSchema = ActionSchema

export const ActionsSchema = getArraySchema(ActionSchema, parseActionUid)

export type Action = z.infer<typeof ActionSchema>

export type ActionUid = z.infer<typeof ActionUidSchema>

export function parseAction(action: Action): Action {
  return ActionSchema.parse(action)
}

export function parseActions(actions: Action[]): Action[] {
  return ActionsSchema.parse(actions)
}

export function parseActionUid(actionUid: ActionUid): ActionUid {
  return ActionUidSchema.parse(actionUid)
}

export const isEqualAction = isEqualByDC(parseActionUid)
