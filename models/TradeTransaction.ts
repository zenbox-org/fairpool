import { isEqualByD } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { TransactionHashSchema } from '../../ethereum/models/TransactionHash'
import { TimestampSchema } from '../../generic/models/Timestamp'

export const TradeTransactionSchema = z.object({
  chainId: z.number().int(),
  hash: TransactionHashSchema,
  timestamp: TimestampSchema,
}).describe('TradeTransaction')

export const TradeTransactionUidSchema = TradeTransactionSchema.pick({
  chainId: true,
  hash: true,
})

export const TradeTransactionsSchema = getArraySchema(TradeTransactionSchema, parseTradeTransactionUid)

export type TradeTransaction = z.infer<typeof TradeTransactionSchema>

export type TradeTransactionUid = z.infer<typeof TradeTransactionUidSchema>

export function parseTradeTransaction(transaction: TradeTransaction): TradeTransaction {
  return TradeTransactionSchema.parse(transaction)
}

export function parseTradeTransactions(transactions: TradeTransaction[]): TradeTransaction[] {
  return TradeTransactionsSchema.parse(transactions)
}

export function parseTradeTransactionUid(transactionUid: TradeTransactionUid): TradeTransactionUid {
  return TradeTransactionUidSchema.parse(transactionUid)
}

export const isEqualTradeTransaction = (a: TradeTransaction) => (b: TradeTransaction) => isEqualByD(a, b, parseTradeTransactionUid)
