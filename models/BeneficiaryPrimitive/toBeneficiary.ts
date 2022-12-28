import { Beneficiary } from '../Beneficiary'
import { BeneficiaryPrimitive } from '../BeneficiaryPrimitive'
import { bn } from '../../../bn/utils'

export function toBeneficiary(primitive: BeneficiaryPrimitive): Beneficiary {
  return {
    ...primitive,
    share: bn(primitive.share),
  }
}
