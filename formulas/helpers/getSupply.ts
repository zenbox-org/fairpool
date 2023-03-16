import { assert } from '../../../utils/bigint/BigIntAllAssertions'
import { add, div, mul, sub } from '../../../utils/bigint/BigIntBasicArithmetic'
import { N } from '../models/bigint'
import { getPriceParamsFun } from './getPriceParamsFun'

export const getBaseSupply = (baseLimit: N, quoteOffset: N) => (quoteSupply: N) => {
  const numerator = mul(baseLimit, quoteSupply)
  const denominator = add(quoteOffset, quoteSupply)
  const baseSupply = div(numerator, denominator)
  assert.lt(baseSupply, baseLimit, 'baseSupply', 'baseLimit')
  return baseSupply
}

export const getQuoteSupply = (baseLimit: N, quoteOffset: N) => (baseSupply: N) => {
  assert.lt(baseSupply, baseLimit, 'baseSupply', 'baseLimit')
  const numerator = mul(quoteOffset, baseSupply)
  const denominator = sub(baseLimit, baseSupply)
  return div(numerator, denominator)
}

export const getBaseSupplyF = getPriceParamsFun(getBaseSupply)

export const getQuoteSupplyF = getPriceParamsFun(getQuoteSupply)
