import { every } from 'lodash-es'
import { getAmountBase } from '../Amount/getAmount'
import { Shift } from './index'

export const isDecreasedUserBalance = (shifts: Shift[]) => {
  const [ante, prev, curr] = shifts.slice(-3)
  const getAmountBaseFirstActionSender = getAmountBase(ante.action.sender)
  return every([
    ante.action.sender === prev.action.sender,
    getAmountBaseFirstActionSender(ante.state) === getAmountBaseFirstActionSender(curr.state),
  ])
}
