import { uint128Max } from '../../bn/constants'

export const priceParamMin = 1000n

export const priceParamMax = uint128Max.toBigInt()

export const baseLimitMin = priceParamMin

export const baseLimitMax = priceParamMax

export const quoteOffsetMin = priceParamMin

export const quoteOffsetMax = priceParamMax

export const quoteOffsetMultiplierMin = quoteOffsetMin / baseLimitMin

export const quoteOffsetMultiplierMaxGetter = (baseLimit: bigint) => baseLimitMax / baseLimit

export const holdersPerDistributionMaxFixed = 256n

export const scaleFixed = 1000000n