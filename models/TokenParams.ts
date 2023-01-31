import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { NameSchema } from '../../generic/models/Name'
import { AmountUint256BNSchema } from '../../ethereum/models/AmountUint256BN'
import { BeneficiariesSchema } from './Beneficiary'
import { AddressSchema } from '../../ethereum/models/Address'

export const TokenParamsSchema = z.object({
  name: NameSchema,
  symbol: NameSchema,
  slope: AmountUint256BNSchema,
  weight: AmountUint256BNSchema,
  royalties: AmountUint256BNSchema,
  earnings: AmountUint256BNSchema,
  fees: AmountUint256BNSchema,
  beneficiaries: BeneficiariesSchema,
  owner: AddressSchema,
  operator: AddressSchema,
  decimals: AmountUint256BNSchema,
  scale: AmountUint256BNSchema,
  isUpgradeable: z.boolean(),
}).describe('TokenParams')

export const TokenParamsUidSchema = TokenParamsSchema.pick({
  symbol: true,
})

export const TokenParamssSchema = getArraySchema(TokenParamsSchema, parseTokenParamsUid)

export type TokenParams = z.infer<typeof TokenParamsSchema>

export type TokenParamsUid = z.infer<typeof TokenParamsUidSchema>

export function parseTokenParams(params: TokenParams): TokenParams {
  return TokenParamsSchema.parse(params)
}

export function parseTokenParamss(paramss: TokenParams[]): TokenParams[] {
  return TokenParamssSchema.parse(paramss)
}

export function parseTokenParamsUid(paramsUid: TokenParamsUid): TokenParamsUid {
  return TokenParamsUidSchema.parse(paramsUid)
}

export const isEqualTokenParams = isEqualByDC(parseTokenParamsUid)
