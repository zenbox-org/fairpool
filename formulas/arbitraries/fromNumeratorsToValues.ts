import { pipe } from 'remeda'
import { BasicArithmetic } from '../../../utils/arithmetic'
import { toBoundedArray } from './toBoundedArray'
import { toQuotients } from './toQuotients'

export const fromNumeratorsToValues = <N>(arithmetic: BasicArithmetic<N>) => (valueMin: N, valueSumMax: N) => (numerators: number[]) => pipe(
  numerators.map(arithmetic.num),
  toQuotients(arithmetic),
  toBoundedArray(arithmetic)(valueMin, valueSumMax)
)
