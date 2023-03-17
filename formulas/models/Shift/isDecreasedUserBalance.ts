import { every } from 'lodash-es'
import { getAmountBase } from '../Amount/getAmount'
import { Shift } from './index'

export const isDecreasedUserBalance = (shifts: Shift[]) => {
  const [first, next, last] = shifts.slice(-3)
  const getAmountBaseFirstActionSender = getAmountBase(first.action.sender)
  return every([
    first.action.sender === next.action.sender,
    getAmountBaseFirstActionSender(first.state) === getAmountBaseFirstActionSender(last.state),
  ])
}
