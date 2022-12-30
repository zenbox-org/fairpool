import { TokenPrimitive } from '../TokenPrimitive'
import { Token } from '../Token'
import { toTokenData } from '../TokenDataPrimitive/toTokenData'
import { toTokenParams } from '../TokenParamsPrimitive/toTokenParams'
import { bn } from '../../../bn/utils'
import { toBalanceBN } from '../../../ethereum/models/BalanceBNPrimitive/toBalanceBN'

export function toToken<T extends TokenPrimitive>(input: T): T & Token {
  const { amount, balances } = input
  return {
    ...toTokenData(toTokenParams(input)),
    amount: bn(amount),
    balances: balances.map(toBalanceBN),
  }
}
