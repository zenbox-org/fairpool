import { req } from '../../../../programming/models/Requirement'
import { todo } from '../../../../utils/todo'
import { Shift } from '../Shift'

const isBuySellCycleReq = req(3, ([ante, prev, curr]: Shift[]) => todo())
