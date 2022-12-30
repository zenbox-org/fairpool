import { TokenParams } from '../TokenParams'
import { TokenParamsPrimitive } from '../TokenParamsPrimitive'
import { toBeneficiaryPrimitive } from '../Beneficiary/toBeneficiaryPrimitive'

export function toTokenParamsPrimitive<T extends TokenParams>(input: T): T & TokenParamsPrimitive {
  const { speed, royalties, dividends, fees, beneficiaries, scale, decimals } = input
  return {
    ...input,
    speed: speed.toString(),
    royalties: royalties.toString(),
    dividends: dividends.toString(),
    fees: fees.toString(),
    beneficiaries: beneficiaries.map(toBeneficiaryPrimitive),
    scale: scale.toString(),
    decimals: decimals.toString(),
  }
}
