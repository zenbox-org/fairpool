import { BuyParams } from '../BuyParams'
import { toFrontendAmountBN } from '../../../../utils/bignumber.convert'
import { BuyFormValues } from '../BuyFormValues'
import { BN } from '../../../../bn'

export const fromBuyParamsToBuyFormValues = (baseDecimals: BN, quoteDecimals: BN) => (input: BuyParams): BuyFormValues => ({
  quoteDeltaProposed: toFrontendAmountBN(input.quoteDeltaProposed, quoteDecimals.toNumber()).toString(),
  baseDeltaMin: toFrontendAmountBN(input.baseDeltaMin, baseDecimals.toNumber()).toString(),
  deadline: input.deadline.toString(),
})
