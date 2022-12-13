import { z } from 'zod'
import { objectInputType, objectOutputType, ZodObject, ZodRawShape, ZodTypeAny } from 'zod/lib/types'
import { UnknownKeysParam } from '../../../utils/zod/types'
import { TableSchema } from '../../../website/models/Table'
import { TokenInfoSchema } from '../../models/TokenInfo'
import { TokenActionSchema } from './TokenAction'

const entype = <T extends ZodRawShape, UnknownKeys extends UnknownKeysParam = 'strip', Catchall extends ZodTypeAny = ZodTypeAny>(name: string, schema: ZodObject<T, UnknownKeys, Catchall, objectOutputType<T, Catchall>, objectInputType<T, Catchall>>) => z.object({
  type: z.literal(name),
}).merge(schema).describe(name)

export const TokenInfoTableSchema = entype('TokenInfoTable', TableSchema(TokenInfoSchema)(TokenActionSchema))

export type TokenInfoTable = z.infer<typeof TokenInfoTableSchema>

export function parseTokenInfoTable(table: TokenInfoTable): TokenInfoTable {
  return TokenInfoTableSchema.parse(table)
}
