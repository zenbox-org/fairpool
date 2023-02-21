import { bn, getPercent } from '../bn/utils'
import { DefaultDecimals as $QuoteDecimals, DefaultScale as $QuoteScale } from '../ethereum/constants'

// updated to 24 after switch to Uni formula
export const BaseDecimals = bn(18)

export const BaseScale = bn(10).pow(BaseDecimals)

export const QuoteDecimals = $QuoteDecimals

export const QuoteScale = $QuoteScale

export const DefaultRoundingPlaces = 6

export const SlopeScale = $QuoteScale

export const DefaultSlope = getPercent(SlopeScale, 5)

export const WeightDecimals = bn(6)

export const WeightScale = bn(10).pow(WeightDecimals)

export const DefaultWeight = getPercent(WeightScale, 30)

export const ShareDecimals = bn(6)

export const ShareScale = bn(10).pow(ShareDecimals)
