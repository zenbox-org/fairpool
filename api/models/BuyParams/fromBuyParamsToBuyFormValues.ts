import { BN } from '../../../../bn'
import { toFrontendAmountBND } from '../../../../utils/BigNumber/conversions'
import { BuyFormValues } from '../BuyFormValues'
import { BuyParams } from '../BuyParams'

export const fromBuyParamsToBuyFormValues = (baseDecimals: BN, quoteDecimals: BN) => (input: BuyParams): BuyFormValues => ({
  quoteDeltaProposed: toFrontendAmountBND(quoteDecimals)(input.quoteDeltaProposed).toString(),
  baseDeltaMin: toFrontendAmountBND(baseDecimals)(input.baseDeltaMin).toString(),
  deadline: input.deadline.toString(),
})
