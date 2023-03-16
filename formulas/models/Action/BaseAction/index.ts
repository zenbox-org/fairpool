import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { AddressSchema } from '../../Address'

export const BaseActionSchema = z.object({
  contract: AddressSchema,
  sender: AddressSchema,
}).describe('BaseAction')

export const BaseActionUidSchema = BaseActionSchema.pick({

})

export const BaseActionsSchema = getArraySchema(BaseActionSchema, parseBaseActionUid)

export type BaseAction = z.infer<typeof BaseActionSchema>

export type BaseActionUid = z.infer<typeof BaseActionUidSchema>

export function parseBaseAction(action: BaseAction): BaseAction {
  return BaseActionSchema.parse(action)
}

export function parseBaseActions(actions: BaseAction[]): BaseAction[] {
  return BaseActionsSchema.parse(actions)
}

export function parseBaseActionUid(actionUid: BaseActionUid): BaseActionUid {
  return BaseActionUidSchema.parse(actionUid)
}

export const isEqualBaseAction = isEqualByDC(parseBaseActionUid)
