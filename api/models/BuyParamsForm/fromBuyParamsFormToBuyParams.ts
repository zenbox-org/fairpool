import { toBackendAmountBN } from '../../../../utils/bignumber.convert'
import { BuyParamsForm } from '../BuyParamsForm'
import { bn } from '../../../../bn/utils'
import { BuyParams } from '../BuyParams'
import { BN } from '../../../../bn'

export const fromBuyParamsFormToBuyParams = (baseDecimals: BN, quoteDecimals: BN) => (input: BuyParamsForm): BuyParams => ({
  quoteDeltaProposed: toBackendAmountBN(input.quoteDeltaProposed, quoteDecimals.toNumber()),
  baseDeltaMin: toBackendAmountBN(input.baseDeltaMin, baseDecimals.toNumber()),
  deadline: bn(input.deadline),
})
