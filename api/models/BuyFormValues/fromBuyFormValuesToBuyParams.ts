import { toBackendAmountBN } from '../../../../utils/bignumber.convert'
import { BuyFormValues } from '../BuyFormValues'
import { bn } from '../../../../bn/utils'
import { BuyParams } from '../BuyParams'
import { BN } from '../../../../bn'

export const fromBuyFormValuesToBuyParams = (baseDecimals: BN, quoteDecimals: BN) => (input: BuyFormValues): BuyParams => ({
  quoteDeltaProposed: toBackendAmountBN(input.quoteDeltaProposed, quoteDecimals.toNumber()),
  baseDeltaMin: toBackendAmountBN(input.baseDeltaMin, baseDecimals.toNumber()),
  deadline: bn(input.deadline),
})
