import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByD } from 'libs/utils/lodash'
import { AddressSchema } from '../../ethereum/models/Address'
import { UintSchema } from '../../ethereum/models/Uint'
import { BeneficiariesSchema } from './Beneficiary'
import { BalancesBNSchema } from '../../ethereum/models/BalanceBN'
import { NameSchema } from '../../generic/models/Name'

export const TokenSchema = z.object({
  address: AddressSchema,
  name: NameSchema,
  symbol: NameSchema,
  decimals: UintSchema,
  owner: AddressSchema,
  speed: UintSchema,
  tax: UintSchema,
  beneficiaries: BeneficiariesSchema,
  balances: BalancesBNSchema,
}).describe('Token')

export const TokenUidSchema = TokenSchema.pick({

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
