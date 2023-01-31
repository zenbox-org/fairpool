import { toFrontendAmountBND } from '../utils/bignumber.convert'
import { BaseDecimals, QuoteDecimals } from './constants.all'
import { WeightDecimals } from './constants'

export const toFrontendBaseScale = toFrontendAmountBND(BaseDecimals)

export const toFrontendQuoteScale = toFrontendAmountBND(QuoteDecimals)

export const toFrontendWeightScale = toFrontendAmountBND(WeightDecimals)
