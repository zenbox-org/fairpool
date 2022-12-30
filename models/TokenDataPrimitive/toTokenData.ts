import { bn } from '../../../bn/utils'
import { TokenDataPrimitive } from '../TokenDataPrimitive'
import { TokenData } from '../TokenData'

export function toTokenData<T extends TokenDataPrimitive>(input: T): T & TokenData {
  const { baseDailyVolume, quoteDailyVolume } = input
  return {
    ...input,
    baseDailyVolume: bn(baseDailyVolume),
    quoteDailyVolume: bn(quoteDailyVolume),
  }
}
