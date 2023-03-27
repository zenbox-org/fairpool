import { req } from '../../../../../programming/models/Requirement'
import { todo } from '../../../../../utils/todo'
import { Shift } from '../../Shift'

export const isSetOwner = req(2, ([prev, curr]: Shift[]) => todo())
