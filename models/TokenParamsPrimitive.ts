import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { NameSchema } from '../../generic/models/Name'
import { AddressSchema } from '../../ethereum/models/Address'
import { BeneficiariesPrimitiveSchema } from './BeneficiaryPrimitive'
import { AmountBNPrimitiveSchema } from '../../ethereum/models/AmountBNPrimitive'

export const TokenParamsPrimitiveSchema = z.object({
  name: NameSchema,
  symbol: NameSchema,
  speed: AmountBNPrimitiveSchema,
  royalties: AmountBNPrimitiveSchema,
  dividends: AmountBNPrimitiveSchema,
  fees: AmountBNPrimitiveSchema,
  beneficiaries: BeneficiariesPrimitiveSchema,
  owner: AddressSchema,
  decimals: AmountBNPrimitiveSchema,
  scale: AmountBNPrimitiveSchema,
}).describe('TokenParamsPrimitive')

export const TokenParamsPrimitiveUidSchema = TokenParamsPrimitiveSchema.pick({

})

export const TokenParamsPrimitivesSchema = getArraySchema(TokenParamsPrimitiveSchema, parseTokenParamsPrimitiveUid)

export type TokenParamsPrimitive = z.infer<typeof TokenParamsPrimitiveSchema>

export type TokenParamsPrimitiveUid = z.infer<typeof TokenParamsPrimitiveUidSchema>

export function parseTokenParamsPrimitive(params: TokenParamsPrimitive): TokenParamsPrimitive {
  return TokenParamsPrimitiveSchema.parse(params)
}

export function parseTokenParamsPrimitives(paramss: TokenParamsPrimitive[]): TokenParamsPrimitive[] {
  return TokenParamsPrimitivesSchema.parse(paramss)
}

export function parseTokenParamsPrimitiveUid(paramsUid: TokenParamsPrimitiveUid): TokenParamsPrimitiveUid {
  return TokenParamsPrimitiveUidSchema.parse(paramsUid)
}

export const isEqualTokenParamsPrimitive = isEqualByDC(parseTokenParamsPrimitiveUid)
