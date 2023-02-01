import { TokenParams } from '../TokenParams'
import { TokenParamsPrimitive } from '../TokenParamsPrimitive'
import { bn } from '../../../bn/utils'
import { toBeneficiary } from '../BeneficiaryPrimitive/toBeneficiary'

export function toTokenParams<T extends TokenParamsPrimitive>(input: T): T & TokenParams {
  const { slope, weight, royalties, earnings, fees, beneficiaries, scale, decimals, scaleOfShares, scaleOfWeight } = input
  return {
    ...input,
    slope: bn(slope),
    weight: bn(weight),
    royalties: bn(royalties),
    earnings: bn(earnings),
    fees: bn(fees),
    beneficiaries: beneficiaries.map(toBeneficiary),
    decimals: bn(decimals),
    scale: bn(scale),
    scaleOfShares: bn(scaleOfShares),
    scaleOfWeight: bn(scaleOfWeight),
  }
}
