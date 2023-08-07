import { toFrontendAmountBND } from '../../../../bignumber-bn/conversions'
import { BN } from '../../../../bn'
import { SellFormValues } from '../SellFormValues'
import { SellParams } from '../SellParams'

export const fromSellParamsToSellFormValues = (baseDecimals: BN, quoteDecimals: BN) => (input: SellParams): SellFormValues => ({
  baseDeltaProposed: toFrontendAmountBND(baseDecimals)(input.baseDeltaProposed).toString(),
  quoteDeltaMin: toFrontendAmountBND(quoteDecimals)(input.quoteDeltaMin).toString(),
  deadline: input.deadline.toString(),
})
