import { uniqWith } from 'remeda'
import { getFintGenTupleKey } from '../../finance/models/FintGenTuple/getFintGenTupleKey'
import { getAssert } from '../../utils/arithmetic/getAssert'
import { BigIntArithmetic } from '../../utils/bigint.arithmetic'
import { isEqualBy } from '../../utils/lodash'
import { getAmountD } from './helpers'
import { Address, Amount, Balance, State } from './uni'

// type Source = 'base' | 'quote'
type BalanceGetter = (state: State) => Balance[]
type AssertBalanceTuple = [Address, BalanceGetter, Amount]

const arithmetic = BigIntArithmetic
const assert = getAssert(arithmetic)

export const assertBalanceDiffs = (stateOld: State) => (tuples: AssertBalanceTuple[]) => {
  const uniques = uniqWith(tuples, isEqualBy(getFintGenTupleKey))
  expect(tuples.length).toEqual(uniques.length)
  return (stateNew: State) => {
    tuples.map((tuple) => {
      const [address, getSpecificBalances, deltaExpected] = tuple
      const balancesOld = getSpecificBalances(stateOld)
      const balancesNew = getSpecificBalances(stateNew)
      const amountOld = getAmountD(address)(balancesOld)
      const amountNew = getAmountD(address)(balancesNew)
      const deltaActual = amountNew - amountOld
      return assert.eq(deltaActual, deltaExpected, 'deltaActual', 'deltaExpected', { tuple, amountOld, amountNew, stateNew })
    })
    return stateNew
  }
}
