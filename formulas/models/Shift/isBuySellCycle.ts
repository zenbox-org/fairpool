import { every } from 'lodash-es'
import { isEqualBase } from '../Action/isEqualBase'
import { getAmountBase } from '../Amount/getAmount'
import { BuySellAnyShiftsSchema } from './BuySellAnyShifts'
import { Shift } from './index'

export const isBuySellCycle = (shifts: Shift[]) => {
  const result = BuySellAnyShiftsSchema.safeParse(shifts.slice(-3))
  if (!result.success) return true // precondition didn't match
  const [{ state: started, action: buy }, { state: bought, action: sell }, { state: sold }] = result.data
  const { contract, sender } = buy
  return every([
    isEqualBase(buy)(sell),
    getAmountBase(sender)(started) === getAmountBase(sender)(sold),
  ])
}
