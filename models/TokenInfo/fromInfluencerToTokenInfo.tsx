import { Influencer } from '../Influencer'
import { parseTokenInfo } from '../TokenInfo'
import { fromInfluencerToScoop } from '../Scoop/fromInfluencerToScoop'

export const fromInfluencerToTokenInfo = (influencer: Influencer) => {
  const locale = influencer.person.language.iso639Code
  return parseTokenInfo({
    ...influencer,
    slug: influencer.username,
    scoops: [fromInfluencerToScoop(influencer)],
    avatarUrl: `https://${(process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DOMAIN)}/avatars/${influencer.id}.jpg`,
  })
}
