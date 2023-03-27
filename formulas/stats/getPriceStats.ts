import { getDeltas } from '../../../utils/arithmetic/getDeltas'
import { BigIntBasicArithmetic } from '../../../utils/bigint/BigIntBasicArithmetic'
import { stringify } from '../../../utils/JSON'
import { rangeBigInt } from '../../../utils/remeda/rangeBigInt'
import { getPriceParamsFun } from '../helpers/getPriceParamsFun'
import { getBaseSupply } from '../helpers/getSupply'
import { getPricingParamsFromFairpool } from '../model'
import { Fairpool } from '../models/Fairpool'

export const getPriceStats = (baseLimit: bigint, quoteOffset: bigint) => (quoteSupplyFrom: bigint, quoteSupplyTo: bigint) => {
  const quoteSupplyArr = rangeBigInt(quoteSupplyFrom, quoteSupplyTo)
  const baseSupplyArr = quoteSupplyArr.map(getBaseSupply(baseLimit, quoteOffset))
  return getDeltas(BigIntBasicArithmetic)(baseSupplyArr)
}

export const getPriceStatsF = getPriceParamsFun(getPriceStats)

export const getPricesStatsString = (fairpool: Fairpool) => (quoteSupplyFrom: bigint, quoteSupplyTo: bigint) => {
  const prices = getPriceStatsF(fairpool)(quoteSupplyFrom, quoteSupplyTo)
  return [stringify(getPricingParamsFromFairpool(fairpool)), prices.join('\n')].join('\n')
}
