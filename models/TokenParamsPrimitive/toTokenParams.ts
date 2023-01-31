import { TokenParams } from '../TokenParams'
import { TokenParamsPrimitive } from '../TokenParamsPrimitive'
import { bn } from '../../../bn/utils'
import { toBeneficiary } from '../BeneficiaryPrimitive/toBeneficiary'

export function toTokenParams<T extends TokenParamsPrimitive>(input: T): T & TokenParams {
  const { slope, weight, royalties, earnings, fees, beneficiaries, scale, decimals } = input
  return {
    ...input,
    slope: bn(slope),
    weight: bn(weight),
    royalties: bn(royalties),
    earnings: bn(earnings),
    fees: bn(fees),
    beneficiaries: beneficiaries.map(toBeneficiary),
    scale: bn(scale),
    decimals: bn(decimals),
  }
}
