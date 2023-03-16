import { pipe } from 'remeda'
import { BasicArithmetic } from '../../../../utils/arithmetic'
import { getBoundedArrayFromQuotients } from '../../../../utils/BoundedArray/getBoundedArrayFromQuotients'
import { getQuotientsFromNumberNumerators } from '../../../../utils/Quotient/getQuotientsFromNumberNumerators'

export const getValuesFromNumerators = <N>(arithmetic: BasicArithmetic<N>) => (valueMin: N, valueSumMax: N) => (numerators: number[]) => pipe(
  getQuotientsFromNumberNumerators(arithmetic)(numerators),
  getBoundedArrayFromQuotients(arithmetic)(valueMin, valueSumMax)
)
