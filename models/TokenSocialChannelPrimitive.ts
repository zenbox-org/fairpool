import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import * as $ from './TokenSocialChannel'

export const TokenSocialChannelPrimitiveSchema = $.TokenSocialChannelSchema.extend({
  followerCountEstimatedAt: z.number(),
}).describe('TokenSocialChannelPrimitive')

export const TokenSocialChannelPrimitiveUidSchema = $.TokenSocialChannelUidSchema

export const TokenSocialChannelPrimitivesSchema = getArraySchema(TokenSocialChannelPrimitiveSchema, parseTokenSocialChannelPrimitiveUid)

export type TokenSocialChannelPrimitive = z.infer<typeof TokenSocialChannelPrimitiveSchema>

export type TokenSocialChannelPrimitiveUid = z.infer<typeof TokenSocialChannelPrimitiveUidSchema>

export function parseTokenSocialChannelPrimitive(primitive: TokenSocialChannelPrimitive): TokenSocialChannelPrimitive {
  return TokenSocialChannelPrimitiveSchema.parse(primitive)
}

export function parseTokenSocialChannelPrimitives(primitives: TokenSocialChannelPrimitive[]): TokenSocialChannelPrimitive[] {
  return TokenSocialChannelPrimitivesSchema.parse(primitives)
}

export function parseTokenSocialChannelPrimitiveUid(primitiveUid: TokenSocialChannelPrimitiveUid): TokenSocialChannelPrimitiveUid {
  return TokenSocialChannelPrimitiveUidSchema.parse(primitiveUid)
}

export const isEqualTokenSocialChannelPrimitive = isEqualByDC(parseTokenSocialChannelPrimitiveUid)
