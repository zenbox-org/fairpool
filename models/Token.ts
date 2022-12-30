import { isEqualByD } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { AddressSchema } from '../../ethereum/models/Address'
import { AmountUint256BNSchema } from '../../ethereum/models/AmountUint256BN'
import { BalancesBNSchema } from '../../ethereum/models/BalanceBN'
import { TokenParamsSchema } from './TokenParams'
import { TokenInfoSchema } from './TokenInfo'
import { TokenDataSchema } from './TokenData'
import { BlockchainNetworkSchema } from '../../blockchain/models/BlockchainNetwork'

export const TokenSchema = z.object({
  address: AddressSchema,
  blockchain: BlockchainNetworkSchema,
  amount: AmountUint256BNSchema, // of native blockchain currency // keep it named "amount" to ensure compatibility with sumAmountBNs()
  balances: BalancesBNSchema,
})
  .merge(TokenParamsSchema)
  .merge(TokenInfoSchema)
  .merge(TokenDataSchema)
  .describe('Token')

export const TokenUidSchema = TokenSchema.pick({
  address: true,
})

export const TokensSchema = getArraySchema(TokenSchema, parseTokenUid)

export type Token = z.infer<typeof TokenSchema>

export type TokenUid = z.infer<typeof TokenUidSchema>

export function parseToken(token: Token): Token {
  return TokenSchema.parse(token)
}

export function parseTokens(tokens: Token[]): Token[] {
  return TokensSchema.parse(tokens)
}

export function parseTokenUid(tokenUid: TokenUid): TokenUid {
  return TokenUidSchema.parse(tokenUid)
}

export const isEqualToken = (a: Token) => (b: Token) => isEqualByD(a, b, parseTokenUid)
