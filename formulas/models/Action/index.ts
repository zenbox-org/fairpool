import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { AddShareSchema } from './BaseAction/AddShare'
import { BuySchema } from './BaseAction/Buy'
import { SellSchema } from './BaseAction/Sell'
import { SetShareNumeratorSchema } from './BaseAction/SetShareNumerator'

export const ActionSchema = z.discriminatedUnion('type', [
  // NoopSchema,
  BuySchema,
  SellSchema,
  AddShareSchema,
  SetShareNumeratorSchema,
]).describe('Action')

export const ActionUidSchema = ActionSchema

export const ActionsSchema = getArraySchema(ActionSchema, parseActionUid)

export type Action = z.infer<typeof ActionSchema>

export type ActionUid = z.infer<typeof ActionUidSchema>

export type ActionType = Action['type']

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
