import { BuyParams } from '../BuyParams'
import { toFrontendAmountBND } from '../../../../utils/bignumber.convert'
import { BuyFormValues } from '../BuyFormValues'
import { BN } from '../../../../bn'

export const fromBuyParamsToBuyFormValues = (baseDecimals: BN, quoteDecimals: BN) => (input: BuyParams): BuyFormValues => ({
  quoteDeltaProposed: toFrontendAmountBND(quoteDecimals)(input.quoteDeltaProposed).toString(),
  baseDeltaMin: toFrontendAmountBND(baseDecimals)(input.baseDeltaMin).toString(),
  deadline: input.deadline.toString(),
})
