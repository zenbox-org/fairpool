import { toBackendAmountBND } from '../../../../bignumber-bn/conversions'
import { BN } from '../../../../bn'
import { bn } from '../../../../bn/utils'
import { num } from '../../../../utils/BigNumber/utils'
import { BuyFormValues } from '../BuyFormValues'
import { BuyParams } from '../BuyParams'

export const fromBuyFormValuesToBuyParams = (baseDecimals: BN, quoteDecimals: BN) => (input: BuyFormValues): BuyParams => ({
  quoteDeltaProposed: toBackendAmountBND(quoteDecimals)(num(input.quoteDeltaProposed)),
  baseDeltaMin: toBackendAmountBND(baseDecimals)(num(input.baseDeltaMin)),
  deadline: bn(input.deadline),
})
