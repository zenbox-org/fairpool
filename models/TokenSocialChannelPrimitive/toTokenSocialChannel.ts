import { TokenSocialChannel } from '../TokenSocialChannel'
import { TokenSocialChannelPrimitive } from '../TokenSocialChannelPrimitive'

export function toTokenSocialChannel<T extends TokenSocialChannelPrimitive>(input: T): T & TokenSocialChannel {
  const { followerCountEstimatedAt } = input
  return {
    ...input,
    followerCountEstimatedAt: new Date(followerCountEstimatedAt),
  }
}
