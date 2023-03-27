import { req } from '../../../../../programming/models/Requirement'
import { Shift } from '../../Shift'

export const isBuy = req(2, ([prev, curr]: Shift[]) => prev.action.type === 'buy')
