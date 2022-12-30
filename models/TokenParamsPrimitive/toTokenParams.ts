import { TokenParams } from '../TokenParams'
import { TokenParamsPrimitive } from '../TokenParamsPrimitive'
import { bn } from '../../../bn/utils'
import { toBeneficiary } from '../BeneficiaryPrimitive/toBeneficiary'

export function toTokenParams<T extends TokenParamsPrimitive>(input: T): T & TokenParams {
  const { speed, royalties, dividends, fees, beneficiaries, scale, decimals } = input
  return {
    ...input,
    speed: bn(speed),
    royalties: bn(royalties),
    dividends: bn(dividends),
    fees: bn(fees),
    beneficiaries: beneficiaries.map(toBeneficiary),
    scale: bn(scale),
    decimals: bn(decimals),
  }
}
