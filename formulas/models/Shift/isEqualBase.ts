import { isEqualBaseArray as $isEqualBaseArray } from '../Action/isEqualBase'
import { Shift } from './index'

export const isEqualBaseArray = (shifts: Shift[]) => $isEqualBaseArray(shifts.map(s => s.action))
