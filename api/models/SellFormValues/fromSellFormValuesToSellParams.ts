import { toBackendAmountBN } from '../../../../utils/bignumber.convert'
import { bn } from '../../../../bn/utils'
import { BN } from '../../../../bn'
import { SellFormValues } from '../SellFormValues'
import { SellParams } from '../SellParams'

export const fromSellFormValuesToSellParams = (baseDecimals: BN, quoteDecimals: BN) => (input: SellFormValues): SellParams => ({
  baseDeltaProposed: toBackendAmountBN(input.baseDeltaProposed, baseDecimals.toNumber()),
  quoteDeltaMin: toBackendAmountBN(input.quoteDeltaMin, quoteDecimals.toNumber()),
  deadline: bn(input.deadline),
})
