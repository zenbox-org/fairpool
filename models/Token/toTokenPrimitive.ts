import { Token } from '../Token'
import { TokenPrimitive } from '../TokenPrimitive'
import { toTokenDataPrimitive } from '../TokenData/toTokenDataPrimitive'
import { toTokenParamsPrimitive } from '../TokenParams/toTokenParamsPrimitive'
import { toBalanceBNPrimitive } from '../../../ethereum/models/BalanceBN/toBalanceBNPrimitive'
import { toTokenSocialChannelPrimitive } from '../TokenSocialChannel/toTokenSocialChannelPrimitive'

export function toTokenPrimitive<T extends Token>(input: T): T & TokenPrimitive {
  const { amount, balances, channels } = input
  return {
    ...toTokenParamsPrimitive(toTokenDataPrimitive(input)),
    amount: amount.toString(),
    balances: balances.map(toBalanceBNPrimitive),
    channels: channels.map(toTokenSocialChannelPrimitive),
  }
}
