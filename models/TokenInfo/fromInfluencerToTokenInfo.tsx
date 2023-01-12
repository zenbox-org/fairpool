import { Influencer } from '../Influencer'
import { parseTokenInfo } from '../TokenInfo'

export const fromInfluencerToTokenInfo = (influencer: Influencer) => parseTokenInfo({
  ...influencer,
  slug: influencer.username,
  avatarUrl: `https://${(process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DOMAIN)}/avatars/${influencer.id}.jpg`,
})
