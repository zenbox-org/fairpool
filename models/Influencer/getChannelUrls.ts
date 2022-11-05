import { getSocialChannelUrl } from '../../../social/models/SocialChannel/getSocialChannelUrl'
import { Influencer } from '../Influencer'

export function getChannelUrls(influencer: Influencer) {
  return influencer.channels.map(getSocialChannelUrl)
}
