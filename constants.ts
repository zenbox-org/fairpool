import { bn } from '../bn/utils'

export const DefaultDecimals = bn(6)

export const DefaultScale = bn(10).pow(DefaultDecimals)

/**
 * baseAmount is always evenly divisible by scale
 */
export const DefaultRoundingPlaces = 0
