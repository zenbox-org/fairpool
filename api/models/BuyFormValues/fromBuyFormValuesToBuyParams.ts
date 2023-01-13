import { toBackendAmountBND } from '../../../../utils/bignumber.convert'
import { BuyFormValues } from '../BuyFormValues'
import { bn } from '../../../../bn/utils'
import { BuyParams } from '../BuyParams'
import { BN } from '../../../../bn'

export const fromBuyFormValuesToBuyParams = (baseDecimals: BN, quoteDecimals: BN) => (input: BuyFormValues): BuyParams => ({
  quoteDeltaProposed: toBackendAmountBND(quoteDecimals)(input.quoteDeltaProposed),
  baseDeltaMin: toBackendAmountBND(baseDecimals)(input.baseDeltaMin),
  deadline: bn(input.deadline),
})
