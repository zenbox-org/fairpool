import { toFrontendAmountBN } from '../../../../utils/bignumber.convert'
import { BN } from '../../../../bn'
import { SellParams } from '../SellParams'
import { SellFormValues } from '../SellFormValues'

export const fromSellParamsToSellFormValues = (baseDecimals: BN, quoteDecimals: BN) => (input: SellParams): SellFormValues => ({
  baseDeltaProposed: toFrontendAmountBN(input.baseDeltaProposed, baseDecimals.toNumber()).toString(),
  quoteDeltaMin: toFrontendAmountBN(input.quoteDeltaMin, quoteDecimals.toNumber()).toString(),
  deadline: input.deadline.toString(),
})
