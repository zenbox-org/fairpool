import { Claim } from '../../../../programming/models/Claim'
import { todo } from '../../../../utils/todo'
import { Shift } from '../Shift'

export const everyShareMustBeWithinItsBounds: Claim<Shift> = {
  premises: [],
  conclusion: {
    length: 1,
    filter: ([curr]: Shift[]) => todo(),
  },
}
