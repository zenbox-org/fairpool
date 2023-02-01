import { Influencer } from '../Influencer'
import { Scoop, ZeroScoop } from '../Scoop'

export function fromInfluencerToScoop(influencer: Influencer, content: Omit<Scoop, 'title' | 'description'> = ZeroScoop): Scoop {
  return {
    ...content,
    ...influencer,
  }
}
