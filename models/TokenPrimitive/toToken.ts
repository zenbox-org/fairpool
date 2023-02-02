import { TokenPrimitive } from '../TokenPrimitive'
import { Token } from '../Token'
import { toTokenData } from '../TokenDataPrimitive/toTokenData'
import { toTokenParams } from '../TokenParamsPrimitive/toTokenParams'
import { bn } from '../../../bn/utils'
import { toBalanceBN } from '../../../ethereum/models/BalanceBNPrimitive/toBalanceBN'
import { toTokenSocialChannel } from '../TokenSocialChannelPrimitive/toTokenSocialChannel'

export function toToken<T extends TokenPrimitive>(input: T): T & Token {
  const { amount, balances, channels } = input
  return {
    ...toTokenData(toTokenParams(input)),
    amount: bn(amount),
    balances: balances.map(toBalanceBN),
    channels: channels.map(toTokenSocialChannel),
  }
}
