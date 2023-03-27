import { Mapper } from '../../../../../generic/models/Mapper'
import { Claim } from '../../../../../programming/models/Claim'
import { req } from '../../../../../programming/models/Requirement'
import { allEqual } from '../../../../../utils/remeda/allEqual'
import { todo } from '../../../../../utils/todo'
import { Fairpool } from '../../Fairpool'
import { Shift } from '../../Shift'
import { senderOfSetOwnerMustBeOwner } from '../senderOfSetOwnerMustBeOwner'

export type Claims = Claim<Shift>[]

type GetClaimsForFields<T> = () => Record<keyof T, Claims>
type ShiftMapper<T> = Mapper<Shift, T>
const neverChanges = <T>(mapper: Mapper<Shift, T>) => (shifts: Shift[]) => allEqual(shifts.map(mapper))
const getFairpoolAddresses = (s: Shift) => s.state.fairpools.map(f => f.address)
const someClaims: Partial<GetClaimsForFields<Fairpool>> = {
  address: [
    {
      premises: [],
      conclusion: req(2, neverChanges(getFairpoolAddresses)),
    },
  ],
}
const getClaimsForAccessControl: GetClaimsForFields<Fairpool> = () => todo(/* someClaims */)
const getClaimsForBounds: GetClaimsForFields<Fairpool> = () => todo()

export const getClaimsViaRequirements = () => todo<Claims>(Array.prototype.concat(
  getClaimsForBounds(),
  getClaimsForAccessControl(),
  [
    senderOfSetOwnerMustBeOwner,
  ],
), 'Write more claims')
