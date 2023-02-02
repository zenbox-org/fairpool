import { toBackendAmountBND } from '../../../../utils/bignumber.convert'
import { bn } from '../../../../bn/utils'
import { BN } from '../../../../bn'
import { SellFormValues } from '../SellFormValues'
import { SellParams } from '../SellParams'
import { num } from '../../../../utils/bignumber'

export const fromSellFormValuesToSellParams = (baseDecimals: BN, quoteDecimals: BN) => (input: SellFormValues): SellParams => ({
  baseDeltaProposed: toBackendAmountBND(baseDecimals)(num(input.baseDeltaProposed)),
  quoteDeltaMin: toBackendAmountBND(quoteDecimals)(num(input.quoteDeltaMin)),
  deadline: bn(input.deadline),
})
