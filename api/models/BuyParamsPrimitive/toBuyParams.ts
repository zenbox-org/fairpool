import { BuyParams } from '../BuyParams'
import { BuyParamsPrimitive } from '../BuyParamsPrimitive'
import { bn } from '../../../../bn/utils'

export function toBuyParams<T extends BuyParamsPrimitive>(input: T): T & BuyParams {
  const { quoteDeltaProposed, baseDeltaMin, deadline } = input
  return {
    ...input,
    quoteDeltaProposed: bn(quoteDeltaProposed),
    baseDeltaMin: bn(baseDeltaMin),
    deadline: bn(deadline),
  }
}
