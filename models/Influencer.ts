import { isEqualByD, Mapper } from 'libs/utils/lodash'
import { getDuplicatesRefinement } from 'libs/utils/zod'
import { z } from 'zod'
import { TickerSchema } from '../../finance/models/Ticker'
import { DescriptionSchema } from '../../generic/models/Description'
import { NameSchema } from '../../generic/models/Name'
import { NotesSchema } from '../../generic/models/Notes'
import { UrlSchema } from '../../generic/models/Url'
import * as $ from '../../influencer-marketing/models/Influencer'
import { InfluencerTagsSchema } from './InfluencerTag'
import { PersonSchema } from './Person'
import { SocialChannelSchema } from './SocialChannel'

export const InfluencerSchema = $.InfluencerSchema.extend({
  channels: z.array(SocialChannelSchema),
  website: UrlSchema.optional(),
  person: PersonSchema,
  username: NameSchema,
  title: NameSchema,
  symbol: TickerSchema,
  description: DescriptionSchema.optional(),
  tags: InfluencerTagsSchema,
  antiBotPhrase: z.string().optional().describe('Used by some influencers to avoid getting spammed by bots'),
  pageCheckedAt: z.date().optional(),
  notes: NotesSchema,
})

export const InfluencersSchema = z.array(InfluencerSchema)
  .superRefine(getDuplicatesRefinement('Influencer', parseInfluencerUid))
  .superRefine(getDuplicatesRefinement('Influencer', i => i.username))

export const InfluencerUidSchema = $.InfluencerUidSchema

export type Influencer = z.infer<typeof InfluencerSchema>

export type InfluencerUid = z.infer<typeof InfluencerUidSchema>

export function parseInfluencer(influencer: Influencer): Influencer {
  return InfluencerSchema.parse(influencer)
}

export function parseInfluencers(influencers: Influencer[]): Influencer[] {
  return InfluencersSchema.parse(influencers)
}

export function parseInfluencerUid(influencerUid: InfluencerUid): InfluencerUid {
  return InfluencerUidSchema.parse(influencerUid)
}

export const isEqualInfluencer = (a: Influencer) => (b: Influencer) => isEqualByD(a, b, parseInfluencerUid)

// export type InfluencerOptional = Optional<Influencer, 'channels' | 'tags'>
export type InfluencerOptional = Influencer

export const mapInfluencerD = <T>(mapper: Mapper<Influencer, T>) => (influencer: InfluencerOptional) => mapper({
  ...influencer,
})
