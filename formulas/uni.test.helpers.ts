import { uniqWith } from 'remeda'
import { getReckGenTupleKey } from '../../finance/models/ReckGenTuple/getReckGenTupleKey'
import { isEqualBy } from '../../utils/lodash'
import { getBalance, Reck, ReckTuple } from './uni'

export const assertBalances = <N>(tuples: ReckTuple[]) => {
  const uniques = uniqWith(tuples, isEqualBy(getReckGenTupleKey))
  expect(tuples.length).toEqual(uniques.length)
  return (balances: Reck[]) => {
    tuples.map((tuple) => {
      const [wallet, asset, amount] = tuple
      const balance = getBalance(asset)(wallet)(balances)
      return expect(balance.amount).toEqual(amount)
    })
    return balances
  }
}
