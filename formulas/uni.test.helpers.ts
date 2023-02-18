import { uniqWith } from 'remeda'
import { getBalanceGenTupleKey } from '../../finance/models/BalanceGenTuple/getBalanceGenTupleKey'
import { isEqualBy } from '../../utils/lodash'
import { Balance, BalanceTuple, getBalance } from './uni'

export const assertBalances = <N>(tuples: BalanceTuple<N>[]) => {
  const uniques = uniqWith(tuples, isEqualBy(getBalanceGenTupleKey))
  expect(tuples.length).toEqual(uniques.length)
  return (balances: Balance<N>[]) => {
    tuples.map((tuple) => {
      const [wallet, asset, amount] = tuple
      const balance = getBalance(asset)(wallet)(balances)
      return expect(balance.amount).toEqual(amount)
    })
    return balances
  }
}
