import { toFrontendAmountBND } from '../../../../utils/bignumber.convert'
import { BN } from '../../../../bn'
import { SellParams } from '../SellParams'
import { SellFormValues } from '../SellFormValues'

export const fromSellParamsToSellFormValues = (baseDecimals: BN, quoteDecimals: BN) => (input: SellParams): SellFormValues => ({
  baseDeltaProposed: toFrontendAmountBND(baseDecimals)(input.baseDeltaProposed).toString(),
  quoteDeltaMin: toFrontendAmountBND(quoteDecimals)(input.quoteDeltaMin).toString(),
  deadline: input.deadline.toString(),
})
