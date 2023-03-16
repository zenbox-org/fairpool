import { Arbitrary } from 'fast-check/lib/types/check/arbitrary/definition/Arbitrary'
import { DistributionParams, parseDistributionParams } from '../models/DistributionParams'
import { getScaledValuesArb } from './getScaledValuesArb'

export const distributionParamsArb: Arbitrary<DistributionParams> = getScaledValuesArb(4).map(distributionParams => parseDistributionParams({
  royalties: distributionParams[0],
  earnings: distributionParams[1],
  fees: distributionParams[2],
  // distributionParams[4] is intentionally unused, so that the total sum may be less than scaleFixed
}))
