import { TokenSocialChannel } from '../TokenSocialChannel'
import { TokenSocialChannelPrimitive } from '../TokenSocialChannelPrimitive'

export function toTokenSocialChannelPrimitive<T extends TokenSocialChannel>(input: T): T & TokenSocialChannelPrimitive {
  const { followerCountEstimatedAt } = input
  return {
    ...input,
    followerCountEstimatedAt: followerCountEstimatedAt.getTime(),
  }
}
