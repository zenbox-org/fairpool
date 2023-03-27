import { req } from '../../../../programming/models/Requirement'
import { todo } from '../../../../utils/todo'
import { isBuy } from './actions/isBuy'
import { isSell } from './actions/isSell'
import { isSetOwner } from './actions/isSetOwner'
import { isWithdraw } from './actions/isWithdraw'
import { oneOf } from './helpers/oneOf'

export const isValidAction = req(2, oneOf(todo([
  isBuy,
  isSell,
  isWithdraw,
  isSetOwner,
], 'Add more action filters')))
