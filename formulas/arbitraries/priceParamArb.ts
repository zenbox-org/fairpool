import { bigInt } from 'fast-check'
import { priceParamMax, priceParamMin } from '../constants'

export const priceParamArb = bigInt({
  min: priceParamMin,
  max: priceParamMax,
})
