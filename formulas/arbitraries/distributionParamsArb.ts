import { Arbitrary } from 'fast-check/lib/types/check/arbitrary/definition/Arbitrary'
import { DistributionParams } from '../uni'
import { getScaledValuesArb } from './getScaledValuesArb'

export const distributionParamsArb: Arbitrary<DistributionParams> = getScaledValuesArb(4).map(distributionParams => ({
  royalties: distributionParams[0],
  earnings: distributionParams[1],
  fees: distributionParams[2],
  // distributionParams[4] is intentionally unused, so that the total sum may be less than scaleFixed
}))
