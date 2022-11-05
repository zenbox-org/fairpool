import { containsInHierarchyArr } from '../../../tree/models/Node/containsInHierarchy'
import { Influencer } from '../Influencer'
import { InfluencerTag, isEqualInfluencerTag } from '../InfluencerTag'

export const hasInfluencerTag = (influencer: Influencer) => (tag: InfluencerTag) => containsInHierarchyArr(isEqualInfluencerTag)(influencer.tags)(tag)
