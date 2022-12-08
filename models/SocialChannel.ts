import { isEqualByD } from 'libs/utils/lodash'
import { getDuplicatesRefinement } from 'libs/utils/zod'
import { z } from 'zod'
import { Url } from '../../generic/models/Url'
import * as $ from '../../social/models/SocialChannel'
import { parseSocialChannelUrl } from '../../social/models/SocialChannel/parseSocialChannelUrl'

export const SocialChannelSchema = $.SocialChannelSchema.pick({
  slug: true,
  type: true,
  notes: true,
  followerCount: true,
  followerCountEstimatedAt: true,
}).extend({

})

export const SocialChannelsSchema = z.array(SocialChannelSchema)
  .superRefine(getDuplicatesRefinement('SocialChannel', parseSocialChannelUid))

export const SocialChannelUidSchema = $.SocialChannelUidSchema

export type SocialChannel = z.infer<typeof SocialChannelSchema>

export type SocialChannelUid = z.infer<typeof SocialChannelUidSchema>

export function parseSocialChannel(channel: SocialChannel): SocialChannel {
  return SocialChannelSchema.parse(channel)
}

export function parseSocialChannels(channels: SocialChannel[]): SocialChannel[] {
  return SocialChannelsSchema.parse(channels)
}

export function parseSocialChannelUid(channelUid: SocialChannelUid): SocialChannelUid {
  return SocialChannelUidSchema.parse(channelUid)
}

export const isEqualSocialChannel = (a: SocialChannel) => (b: SocialChannel) => isEqualByD(a, b, parseSocialChannelUid)

export const parseChannelByUrl = (url: Url, followerCount: number, followerCountEstimatedAt: Date) => {
  return parseSocialChannel({
    ...(parseSocialChannelUrl(url)),
    followerCount,
    followerCountEstimatedAt,
  })
}
