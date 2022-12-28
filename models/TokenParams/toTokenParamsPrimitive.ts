import { TokenParams } from '../TokenParams'
import { TokenParamsPrimitive } from '../TokenParamsPrimitive'
import { toBeneficiaryPrimitive } from '../Beneficiary/toBeneficiaryPrimitive'

export function toTokenParamsPrimitive(params: TokenParams): TokenParamsPrimitive {
  const { speed, royalties, dividends, fees, beneficiaries, scale, decimals } = params
  return {
    ...params,
    speed: speed.toString(),
    royalties: royalties.toString(),
    dividends: dividends.toString(),
    fees: fees.toString(),
    beneficiaries: beneficiaries.map(toBeneficiaryPrimitive),
    scale: scale.toString(),
    decimals: decimals.toString(),
  }
}
