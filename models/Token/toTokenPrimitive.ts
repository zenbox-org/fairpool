import { Token } from '../Token'
import { TokenPrimitive } from '../TokenPrimitive'
import { toTokenDataPrimitive } from '../TokenData/toTokenDataPrimitive'
import { toTokenParamsPrimitive } from '../TokenParams/toTokenParamsPrimitive'
import { toBalanceBNPrimitive } from '../../../ethereum/models/BalanceBN/toBalanceBNPrimitive'

export function toTokenPrimitive<T extends Token>(input: T): T & TokenPrimitive {
  const { amount, balances } = input
  return {
    ...toTokenParamsPrimitive(toTokenDataPrimitive(input)),
    amount: amount.toString(),
    balances: balances.map(toBalanceBNPrimitive),
  }
}
