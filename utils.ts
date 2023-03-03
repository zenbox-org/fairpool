import { toFrontendAmountBND } from '../utils/BigNumber.convert'
import { BaseDecimals, QuoteDecimals, QuoteScale, ShareScale, WeightDecimals, WeightScale } from './constants'
import { BigNumberish } from 'ethers'
import { getShare as getShareOriginal } from '../bn/utils'

export const toFrontendBaseScale = toFrontendAmountBND(BaseDecimals)

export const toFrontendQuoteScale = toFrontendAmountBND(QuoteDecimals)

export const toFrontendWeightScale = toFrontendAmountBND(WeightDecimals)

export const getWeightPercent = (numerator: BigNumberish, denominator: BigNumberish = 100) => getShareOriginal(WeightScale, numerator, denominator)

export const getSharePercent = (numerator: BigNumberish, denominator: BigNumberish = 100) => getShareOriginal(ShareScale, numerator, denominator)

export const getQuotePercent = (numerator: BigNumberish, denominator: BigNumberish = 100) => getShareOriginal(QuoteScale, numerator, denominator)
