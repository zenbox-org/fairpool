import { BuyParams } from '../BuyParams'
import { toFrontendAmountBN } from '../../../../utils/bignumber.convert'
import { BuyParamsForm } from '../BuyParamsForm'
import { BN } from '../../../../bn'

export const fromBuyParamsToBuyParamsForm = (baseDecimals: BN, quoteDecimals: BN) => (input: BuyParams): BuyParamsForm => ({
  quoteDeltaProposed: toFrontendAmountBN(input.quoteDeltaProposed, quoteDecimals.toNumber()).toString(),
  baseDeltaMin: toFrontendAmountBN(input.baseDeltaMin, baseDecimals.toNumber()).toString(),
  deadline: input.deadline.toString(),
})
