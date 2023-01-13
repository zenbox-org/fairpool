import { toBackendAmountBND } from '../../../../utils/bignumber.convert'
import { bn } from '../../../../bn/utils'
import { BN } from '../../../../bn'
import { SellFormValues } from '../SellFormValues'
import { SellParams } from '../SellParams'

export const fromSellFormValuesToSellParams = (baseDecimals: BN, quoteDecimals: BN) => (input: SellFormValues): SellParams => ({
  baseDeltaProposed: toBackendAmountBND(baseDecimals)(input.baseDeltaProposed),
  quoteDeltaMin: toBackendAmountBND(quoteDecimals)(input.quoteDeltaMin),
  deadline: bn(input.deadline),
})
