import { isEqualByD } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { TokenSchema, TokenUidSchema } from './Token'
import { VolumeAmountSchema } from './VolumeAmount'

export const TokenInfoSchema = z.object({
  token: TokenSchema,
  baseDailyVolume: VolumeAmountSchema,
  quoteDailyVolume: VolumeAmountSchema,
}).describe('TokenInfo')

export const TokenInfoUidSchema = z.object({
  token: TokenUidSchema,
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
