import { TokenParams } from '../TokenParams'
import { TokenParamsPrimitive } from '../TokenParamsPrimitive'
import { toBeneficiaryPrimitive } from '../Beneficiary/toBeneficiaryPrimitive'

export function toTokenParamsPrimitive<T extends TokenParams>(input: T): T & TokenParamsPrimitive {
  const { slope, weight, royalties, earnings, fees, beneficiaries, scale, decimals } = input
  return {
    ...input,
    slope: slope.toString(),
    weight: weight.toString(),
    royalties: royalties.toString(),
    earnings: earnings.toString(),
    fees: fees.toString(),
    beneficiaries: beneficiaries.map(toBeneficiaryPrimitive),
    scale: scale.toString(),
    decimals: decimals.toString(),
  }
}
