import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { VolumeAmountSchema } from './VolumeAmount'

export const TokenDataSchema = z.object({
  baseDailyVolume: VolumeAmountSchema,
  quoteDailyVolume: VolumeAmountSchema,
}).describe('TokenData')

export const TokenDataUidSchema = TokenDataSchema

export const TokenDatasSchema = getArraySchema(TokenDataSchema, parseTokenDataUid)

export type TokenData = z.infer<typeof TokenDataSchema>

export type TokenDataUid = z.infer<typeof TokenDataUidSchema>

export function parseTokenData(data: TokenData): TokenData {
  return TokenDataSchema.parse(data)
}

export function parseTokenDatas(datas: TokenData[]): TokenData[] {
  return TokenDatasSchema.parse(datas)
}

export function parseTokenDataUid(dataUid: TokenDataUid): TokenDataUid {
  return TokenDataUidSchema.parse(dataUid)
}

export const isEqualTokenData = isEqualByDC(parseTokenDataUid)
