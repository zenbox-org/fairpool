import { isEqualByD } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { TokenSlugSchema } from './TokenSlug'
import { UrlSchema } from '../../generic/models/Url'
import { TokenSocialChannelsSchema } from './TokenSocialChannel'
import { NonEmptyScoopsSchema } from './Scoop'

export const TokenInfoSchema = z.object({
  slug: TokenSlugSchema,
  scoops: NonEmptyScoopsSchema,
  website: UrlSchema.optional(),
  avatarUrl: UrlSchema,
  channels: TokenSocialChannelsSchema,
}).describe('TokenInfo')

export const TokenInfoUidSchema = TokenInfoSchema.pick({
  slug: true,
})

export const TokenInfosSchema = getArraySchema(TokenInfoSchema, parseTokenInfoUid)

export type TokenInfo = z.infer<typeof TokenInfoSchema>

export type TokenInfoUid = z.infer<typeof TokenInfoUidSchema>

export function parseTokenInfo(info: TokenInfo): TokenInfo {
  return TokenInfoSchema.parse(info)
}

export function parseTokenInfos(infos: TokenInfo[]): TokenInfo[] {
  return TokenInfosSchema.parse(infos)
}

export function parseTokenInfoUid(infoUid: TokenInfoUid): TokenInfoUid {
  return TokenInfoUidSchema.parse(infoUid)
}

export const isEqualTokenInfo = (a: TokenInfo) => (b: TokenInfo) => isEqualByD(a, b, parseTokenInfoUid)
