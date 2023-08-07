import { toBackendAmountBND } from '../../../../bignumber-bn/conversions'
import { BN } from '../../../../bn'
import { bn } from '../../../../bn/utils'
import { num } from '../../../../utils/BigNumber/utils'
import { SellFormValues } from '../SellFormValues'
import { SellParams } from '../SellParams'

export const fromSellFormValuesToSellParams = (baseDecimals: BN, quoteDecimals: BN) => (input: SellFormValues): SellParams => ({
  baseDeltaProposed: toBackendAmountBND(baseDecimals)(num(input.baseDeltaProposed)),
  quoteDeltaMin: toBackendAmountBND(quoteDecimals)(num(input.quoteDeltaMin)),
  deadline: bn(input.deadline),
})
