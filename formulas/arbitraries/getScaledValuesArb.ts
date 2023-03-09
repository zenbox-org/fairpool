import { scaleFixed } from '../constants'
import { getNumeratorsArb } from './getNumeratorsArb'
import { BigIntQuotientFunctions } from './getQuotientFunctions'

export const getScaledValuesArb = (length: number) => {
  return getNumeratorsArb(length, 0)
    .map(BigIntQuotientFunctions.fromNumeratorsToValues(0n, scaleFixed))
}
