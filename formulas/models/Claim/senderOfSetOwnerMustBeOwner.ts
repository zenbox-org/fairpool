import { Claim } from '../../../../programming/models/Claim'
import { isSetOwner } from '../Requirement/actions/isSetOwner'
import { senderIsOwner } from '../Requirement/senderIsOwner'
import { Shift } from '../Shift'

export const senderOfSetOwnerMustBeOwner: Claim<Shift> = {
  premises: [isSetOwner],
  conclusion: senderIsOwner,
}
