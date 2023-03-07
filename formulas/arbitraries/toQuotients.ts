/**
 * output is a share of num (~ num * numerator / denominator)
 */
import { BasicArithmetic } from '../../../utils/arithmetic'
import { sum } from '../../../utils/arithmetic/sum'

export const toQuotients = <N>(arithmetic: BasicArithmetic<N>) => (numerators: N[]) => {
  const denominator = sum(arithmetic)(numerators)
  return numerators.map(numerator => ({ numerator, denominator }))
}
