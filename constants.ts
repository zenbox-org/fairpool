import { bn } from '../bn/utils'
import { DefaultScale as QuoteScale } from '../ethereum/constants'

// updated to 18 after switch to Bancor formula
export const DefaultDecimals = bn(18)

export const DefaultScale = bn(10).pow(DefaultDecimals)

export const DefaultRoundingPlaces = 6

export const WeightDecimals = bn(6)

export const WeightScale = bn(10).pow(WeightDecimals)

export const DefaultQuoteBuffer = QuoteScale.mul(10)
