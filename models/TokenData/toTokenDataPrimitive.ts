import { TokenData } from '../TokenData'
import { TokenDataPrimitive } from '../TokenDataPrimitive'

export function toTokenDataPrimitive<T extends TokenData>(input: T): T & TokenDataPrimitive {
  const { baseDailyVolume, quoteDailyVolume } = input
  return {
    ...input,
    baseDailyVolume: baseDailyVolume.toString(),
    quoteDailyVolume: quoteDailyVolume.toString(),
  }
}
