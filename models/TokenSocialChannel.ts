import { isEqualByDC } from 'libs/utils/lodash'
import { getDuplicatesRefinement } from 'libs/utils/zod'
import { z } from 'zod'
import * as $ from '../../social/models/SocialChannel'

export const TokenSocialChannelSchema = $.SocialChannelSchema.pick({
  slug: true,
  type: true,
  followerCount: true,
  followerCountEstimatedAt: true,
}).extend({

})

export const TokenSocialChannelsSchema = z.array(TokenSocialChannelSchema)
  .superRefine(getDuplicatesRefinement('TokenSocialChannel', parseTokenSocialChannelUid))

export const TokenSocialChannelUidSchema = $.SocialChannelUidSchema

export type TokenSocialChannel = z.infer<typeof TokenSocialChannelSchema>

export type TokenSocialChannelUid = z.infer<typeof TokenSocialChannelUidSchema>

export function parseTokenSocialChannel(channel: TokenSocialChannel): TokenSocialChannel {
  return TokenSocialChannelSchema.parse(channel)
}

export function parseTokenSocialChannels(channels: TokenSocialChannel[]): TokenSocialChannel[] {
  return TokenSocialChannelsSchema.parse(channels)
}

export function parseTokenSocialChannelUid(channelUid: TokenSocialChannelUid): TokenSocialChannelUid {
  return TokenSocialChannelUidSchema.parse(channelUid)
}

export const isEqualTokenSocialChannel = isEqualByDC(parseTokenSocialChannelUid)
