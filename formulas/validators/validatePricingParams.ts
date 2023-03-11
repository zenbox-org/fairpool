import { assert } from '../../../utils/bigint/BigIntBasicArithmetic'
import { baseLimitMax, baseLimitMin, quoteOffsetMax, quoteOffsetMin } from '../constants'
import { PriceParams } from '../uni'

export const validatePricingParams = <T extends PriceParams>(params: T) => {
  const { baseLimit, quoteOffset } = params
  // const quoteOffsetCalculated = (quoteOffset / baseLimit) * baseLimit
  assert.gte(baseLimit, baseLimitMin, 'baseLimit', 'baseLimitMin')
  assert.lte(baseLimit, baseLimitMax, 'baseLimit', 'baseLimitMax')
  assert.gte(quoteOffset, quoteOffsetMin, 'quoteOffset', 'quoteOffsetMin')
  assert.lte(quoteOffset, quoteOffsetMax, 'quoteOffset', 'quoteOffsetMax')
  assert.gte(quoteOffset, baseLimit, 'quoteOffset', 'baseLimit', {}, 'Required for gte(quoteDelta, baseDelta)')
  // assert.eq(quoteOffsetCalculated, quoteOffset, 'quoteOffsetCalculated', 'quoteOffset', {}, 'Required for quoteOffset = k * baseLimit')
  return params
}
