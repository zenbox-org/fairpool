import { BN } from '../../../bn'
import { sqrt } from '../../../bn/sqrt'

export const getQuoteFromBase = (base: BN, speed: BN, scale: BN) => base.mul(speed).div(scale).pow(2)

export const getBaseFromQuote = (quote: BN, speed: BN, scale: BN) => sqrt(quote).mul(scale).div(speed)
