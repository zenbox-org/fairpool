import { bigInt } from 'fast-check'
import { priceParamMax, priceParamMin } from '../models/PriceParam/constants'

export const priceParamArb = bigInt({
  min: priceParamMin,
  max: priceParamMax,
})
