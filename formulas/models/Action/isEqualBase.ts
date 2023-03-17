import { equals } from 'remeda'
import { allEqual } from '../../../../utils/remeda/allEqual'
import { BaseActionSchema } from './BaseAction'
import { Action } from './index'

export const isEqualBase = (b: Action) => (a: Action) => equals(BaseActionSchema.parse(a), BaseActionSchema.parse(b))

export const isEqualBaseArray = (actions: Action[]) => allEqual(actions.map(a => BaseActionSchema.parse(a)))
