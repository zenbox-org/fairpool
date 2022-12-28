import { z } from 'zod'
import { TableSchema } from '../../../website/models/Table'
import { TokenActionSchema } from './TokenAction'
import { addTypeField } from '../../../utils/zod/addTypeField'
import { TokenSchema } from '../../models/Token'

export const TokenInfoTableSchema = addTypeField('TokenInfoTable', TableSchema(TokenSchema)(TokenActionSchema))

export type TokenInfoTable = z.infer<typeof TokenInfoTableSchema>

export function parseTokenInfoTable(table: TokenInfoTable): TokenInfoTable {
  return TokenInfoTableSchema.parse(table)
}
