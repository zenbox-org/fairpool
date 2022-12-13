import { isEqualByD } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { AddressSchema } from '../../ethereum/models/Address'
import { AmountUint256BNSchema } from '../../ethereum/models/AmountUint256BN'
import { BalancesBNSchema } from '../../ethereum/models/BalanceBN'
import { NameSchema } from '../../generic/models/Name'
import { BeneficiariesSchema } from './Beneficiary'

export const TokenParamsSchema = z.object({
  name: NameSchema,
  symbol: NameSchema,
  speed: AmountUint256BNSchema,
  tax: AmountUint256BNSchema,
  beneficiaries: BeneficiariesSchema,
  owner: AddressSchema,
})

export const TokenSchema = TokenParamsSchema.extend({
  address: AddressSchema,
  amount: AmountUint256BNSchema, // of native blockchain currency
  decimals: AmountUint256BNSchema,
  balances: BalancesBNSchema,
}).describe('Token')

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
