import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { TokenSchema } from './Token'
import { TokenParamsPrimitiveSchema } from './TokenParamsPrimitive'
import { TokenDataPrimitiveSchema } from './TokenDataPrimitive'
import { AmountBNPrimitiveSchema } from '../../ethereum/models/AmountBNPrimitive'
import { BalancesBNPrimitiveSchema } from '../../ethereum/models/BalanceBNPrimitive'
import { TokenSocialChannelPrimitivesSchema } from './TokenSocialChannelPrimitive'

export const TokenPrimitiveSchema = TokenSchema
  .extend({
    amount: AmountBNPrimitiveSchema,
    balances: BalancesBNPrimitiveSchema,
    channels: TokenSocialChannelPrimitivesSchema,
  })
  .merge(TokenParamsPrimitiveSchema)
  .merge(TokenDataPrimitiveSchema)
  .describe('TokenPrimitive')

export const TokenPrimitiveUidSchema = TokenPrimitiveSchema.pick({

})

export const TokenPrimitivesSchema = getArraySchema(TokenPrimitiveSchema, parseTokenPrimitiveUid)

export type TokenPrimitive = z.infer<typeof TokenPrimitiveSchema>

export type TokenPrimitiveUid = z.infer<typeof TokenPrimitiveUidSchema>

export function parseTokenPrimitive(token: TokenPrimitive): TokenPrimitive {
  return TokenPrimitiveSchema.parse(token)
}

export function parseTokenPrimitives(tokens: TokenPrimitive[]): TokenPrimitive[] {
  return TokenPrimitivesSchema.parse(tokens)
}

export function parseTokenPrimitiveUid(tokenUid: TokenPrimitiveUid): TokenPrimitiveUid {
  return TokenPrimitiveUidSchema.parse(tokenUid)
}

export const isEqualTokenPrimitive = isEqualByDC(parseTokenPrimitiveUid)
