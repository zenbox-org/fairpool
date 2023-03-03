import { assert } from '../../../utils/bigint.arithmetic'
import { DistributionParams } from '../uni'

export const validateDistributionParams = (scale: bigint) => (params: DistributionParams) => {
  const taxesSum = params.royalties + params.earnings + params.fees
  assert.gtelte(0n, scale)(taxesSum)
  return params
}
