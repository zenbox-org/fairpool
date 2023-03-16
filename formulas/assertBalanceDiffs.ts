import { uniqWith } from 'remeda'
import { Address as Address } from '../../ethereum/models/Address'
import { getFintGenTupleKey } from '../../finance/models/FintGenTuple/getFintGenTupleKey'
import { BigIntAllAssertions } from '../../utils/bigint/BigIntAllAssertions'
import { isEqualBy } from '../../utils/lodash'
import { getAmountD } from './helpers/getAmount'
import { Amount } from './models/Amount'
import { Balance } from './models/Balance'
import { State } from './models/State' // type Source = 'base' | 'quote'

// type Source = 'base' | 'quote'
type BalanceGetter = (state: State) => Balance[]
type AssertBalanceTuple = [Address, BalanceGetter, Amount]

const assert = BigIntAllAssertions

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
