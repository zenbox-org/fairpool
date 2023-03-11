import { BasicArithmetic } from '../../../../utils/arithmetic'
import { getBoundedArrayFromQuotients } from '../../../../utils/BoundedArray/getBoundedArrayFromQuotients'
import { getQuotientsFromNumberNumerators } from '../../../../utils/Quotient/getQuotientsFromNumberNumerators'
import { getQuotientsFromNumerators } from '../../../../utils/Quotient/getQuotientsFromNumerators'
import { getValuesFromNumerators } from '../../arbitraries/getValuesFromNumerators'

export const getQuotientFunctions = <N>(arithmetic: BasicArithmetic<N>) => ({
  getQuotientsFromNumberNumerators: getQuotientsFromNumberNumerators(arithmetic),
  getBoundedArrayFromQuotients: getBoundedArrayFromQuotients(arithmetic),
  getQuotientsFromNumerators: getQuotientsFromNumerators(arithmetic),
  getValuesFromNumerators: getValuesFromNumerators(arithmetic),
})
