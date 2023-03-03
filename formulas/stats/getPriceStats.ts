import { getDeltas } from '../../../utils/arithmetic/getDeltas'
import { BigIntArithmetic } from '../../../utils/bigint.arithmetic'
import { stringify } from '../../../utils/JSON'
import { rangeBigInt } from '../../../utils/remeda/rangeBigInt'
import { Fairpool, getBaseSupply, getFairpoolFun, getPricingParamsFromFairpool } from '../uni'

export const getPriceStats = (baseLimit: bigint, quoteOffset: bigint) => (quoteSupplyFrom: bigint, quoteSupplyTo: bigint) => {
  const quoteSupplyArr = rangeBigInt(quoteSupplyFrom, quoteSupplyTo)
  const baseSupplyArr = quoteSupplyArr.map(getBaseSupply(baseLimit, quoteOffset))
  return getDeltas(BigIntArithmetic)(baseSupplyArr)
}

export const getPriceStatsF = getFairpoolFun(getPriceStats)

export const getPricesStatsString = (fairpool: Fairpool) => (quoteSupplyFrom: bigint, quoteSupplyTo: bigint) => {
  const prices = getPriceStatsF(fairpool)(quoteSupplyFrom, quoteSupplyTo)
  return [stringify(getPricingParamsFromFairpool(fairpool)), prices.join('\n')].join('\n')
}
