import { test } from '@jest/globals'
import { integer } from 'fast-check'
import { BN } from '../../../bn'
import { bn } from '../../../bn/utils'
import { expect } from '../../../chai/init'
import { getBaseFromQuote, getQuoteFromBase } from './conversion'

function getDiff(base: BN, speed: BN, scale: BN) {
  const $quote = getQuoteFromBase(base, speed, scale)
  const $base = getBaseFromQuote($quote, speed, scale)
  return $base.sub(base).abs()
}

function expectConversionEqual(base: BN, speed: BN, scale: BN) {
  const $diff = getDiff(base, speed, scale)
  // there may be a small difference due to rounding
  expect($diff.lte(1)).to.be.true
}

test('conversion', () => {
  expectConversionEqual(bn(13333333333333), bn(1200), bn(1000))
})

const integer1 = () => integer({ min: 1 })

// test('conversion (fast-check)', () => {
//   assert(
//     property(integer1(), integer1(), integer1(), (base, speed, scale) => {
//       return getDiff(bn(base), bn(speed), bn(scale)).lte(1)
//     })
//   )
// })
