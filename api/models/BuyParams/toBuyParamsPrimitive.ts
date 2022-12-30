import { BuyParams } from '../BuyParams'
import { BuyParamsPrimitive } from '../BuyParamsPrimitive'

export function toBuyParamsPrimitive<T extends BuyParams>(input: T): T & BuyParamsPrimitive {
  const { quoteDeltaProposed, baseDeltaMin, deadline } = input
  return {
    ...input,
    quoteDeltaProposed: quoteDeltaProposed.toString(),
    baseDeltaMin: baseDeltaMin.toString(),
    deadline: deadline.toString(),
  }
}
