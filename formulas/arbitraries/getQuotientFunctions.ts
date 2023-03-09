import { BasicArithmetic } from '../../../utils/arithmetic'
import { BigIntBasicArithmetic } from '../../../utils/bigint/arithmetic'
import { fromNumeratorsToValues } from './fromNumeratorsToValues'
import { toBoundedArray } from './toBoundedArray'
import { toQuotients } from './toQuotients'

export const getQuotientFunctions = <N>(arithmetic: BasicArithmetic<N>) => ({
  toQuotients: toQuotients(arithmetic),
  toBoundedArray: toBoundedArray(arithmetic),
  fromNumeratorsToValues: fromNumeratorsToValues(arithmetic),
})

export const BigIntQuotientFunctions = getQuotientFunctions(BigIntBasicArithmetic)
