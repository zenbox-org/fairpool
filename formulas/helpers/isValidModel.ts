import { map } from '../../../decimaker/models/Generator/map'
import { isValidClaim } from '../../../programming/models/Claim/isValidClaim'
import { Claims } from '../models/Claim/getClaims/getClaimsViaRequirements'
import { Shift } from '../models/Shift'

export type Shifts = Shift[]

type Validator = (claims: Claims) => (generator: Generator<Shifts>) => boolean[]

export const isValidModel: Validator = (claims: Claims) => map((history: Shifts) => claims.every(isValidClaim(history)))
