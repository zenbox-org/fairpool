import { toBackendAmountBND } from '../../../../utils/BigNumber.convert'
import { BuyFormValues } from '../BuyFormValues'
import { bn } from '../../../../bn/utils'
import { BuyParams } from '../BuyParams'
import { BN } from '../../../../bn'
import { num } from '../../../../utils/BigNumber.utils'

export const fromBuyFormValuesToBuyParams = (baseDecimals: BN, quoteDecimals: BN) => (input: BuyFormValues): BuyParams => ({
  quoteDeltaProposed: toBackendAmountBND(quoteDecimals)(num(input.quoteDeltaProposed)),
  baseDeltaMin: toBackendAmountBND(baseDecimals)(num(input.baseDeltaMin)),
  deadline: bn(input.deadline),
})
