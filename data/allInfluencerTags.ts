import { InfluencerTag, InfluencerTagSchema, parseInfluencerTagUid } from 'libs/fairpool/models/InfluencerTag'
import { getFinder, getInserter, getName } from 'libs/utils/zod'

export const allInfluencerTags: InfluencerTag[] = []

export const addInfluencerTag = getInserter(getName(InfluencerTagSchema), InfluencerTagSchema, parseInfluencerTagUid, allInfluencerTags)

export const findInfluencerTag = getFinder(parseInfluencerTagUid, allInfluencerTags)

export const Health = addInfluencerTag({
  id: 'Health',
})

export const Money = addInfluencerTag({
  id: 'Money',
})

export const Entertainment = addInfluencerTag({
  id: 'Entertainment',
})

export const Business = addInfluencerTag({
  id: 'Business',
  parent: Money,
})

export const Crypto = addInfluencerTag({
  id: 'Crypto',
  parent: Money,
})

export const Art = addInfluencerTag({
  id: 'Art',
})

export const PlayToEarn = addInfluencerTag({
  id: 'PlayToEarn',
  parent: Crypto,
})

export const NFT = addInfluencerTag({
  id: 'NFT',
  parent: Crypto,
})

export const Wellness = addInfluencerTag({
  id: 'Wellness',
  parent: Health,
})

export const Lifestyle = addInfluencerTag({
  id: 'Lifestyle',
  parent: Entertainment,
})

export const Gaming = addInfluencerTag({
  id: 'Gaming',
  parent: Entertainment,
})

export const AltcoinBuffet = addInfluencerTag({
  id: 'AltcoinBuffet',
  parent: Crypto,
})

export const CryptoCharts = addInfluencerTag({
  id: 'Charts',
  parent: Crypto,
})
