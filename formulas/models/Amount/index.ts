import { getArraySchema } from 'libs/utils/zod'
import { equals } from 'remeda'
import { z } from 'zod'
import { Uint256BigIntSchema } from '../../../../ethereum/models/Uint256BigInt'

export const AmountSchema = Uint256BigIntSchema.describe('Amount')

export const AmountsSchema = getArraySchema(AmountSchema, parseAmount)

export type Amount = z.infer<typeof AmountSchema>

export function parseAmount(amount: Amount): Amount {
  return AmountSchema.parse(amount)
}

export function parseAmounts(amounts: Amount[]): Amount[] {
  return AmountsSchema.parse(amounts)
}

export const isEqualAmount = equals
