import { BigIntQuotientFunctions } from '../models/bigint/BigIntQuotientFunctions'
import { scaleFixed } from '../models/Fairpool/constants'
import { getNumeratorsArb } from './getNumeratorsArb'

export const getScaledValuesArb = (length: number) => {
  return getNumeratorsArb(length, 0)
    .map(BigIntQuotientFunctions.getValuesFromNumerators(0n, scaleFixed))
}
