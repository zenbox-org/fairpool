import { BigIntBasicArithmetic } from '../../../../utils/bigint/BigIntBasicArithmetic'
import { getQuotientFunctions } from './getQuotientFunctions'

export const BigIntQuotientFunctions = getQuotientFunctions(BigIntBasicArithmetic)

export const { getQuotientsFromNumberNumerators, getBoundedArrayFromQuotients, getQuotientsFromNumerators, getValuesFromNumerators } = BigIntQuotientFunctions
