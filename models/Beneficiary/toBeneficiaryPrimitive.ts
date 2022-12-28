import { Beneficiary } from '../Beneficiary'
import { BeneficiaryPrimitive } from '../BeneficiaryPrimitive'

export function toBeneficiaryPrimitive(beneficiary: Beneficiary): BeneficiaryPrimitive {
  return {
    ...beneficiary,
    share: beneficiary.share.toString(),
  }
}
