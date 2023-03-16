import { equals } from 'remeda'
import { BaseActionSchema } from './BaseAction'
import { Action } from './index'

export const isEqualBase = (b: Action) => (a: Action) => equals(BaseActionSchema.parse(a), BaseActionSchema.parse(b))
