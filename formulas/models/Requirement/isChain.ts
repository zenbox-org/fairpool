import { allEqual } from '../../../../utils/remeda/allEqual'
import { Action } from '../Action'
import { parseBaseAction } from '../Action/BaseAction'
import { Shift } from '../Shift'

export const isChain = (actions: Action[]) => allEqual(actions.map(parseBaseAction))

export const isChainS = (shifts: Shift[]) => isChain(shifts.map(s => s.action))
