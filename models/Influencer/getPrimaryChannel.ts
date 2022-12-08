import { isEqual } from 'lodash-es'
import { ensure } from 'libs/utils/ensure'
import { SocialChannelType } from '../../../social/models/SocialChannelType'
import { Influencer } from '../Influencer'

export const getPrimaryChannel = (preferences: SocialChannelType[]) => (influencer: Influencer) => {
  for (const type of preferences) {
    const channel = influencer.channels.find(c => isEqual(c.type, type))
    if (channel) return channel
  }
  return ensure(influencer.channels[0])
}
