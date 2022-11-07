import { z } from 'zod'
import { getArraySchema } from 'zenbox-util/zod'
import { isEqualBy } from 'zenbox-util/lodash'
import { TransactionHashSchema } from '../../ethereum/models/TransactionHash'
import { AddressSchema } from '../../ethereum/models/Address'
import { TimestampSchema } from '../../generic/models/Timestamp'

export const TradeTransactionSchema = z.object({
  hash: TransactionHashSchema,
  sender: AddressSchema,
  timestamp: TimestampSchema,
}).describe('TradeTransaction')

export const TradeTransactionUidSchema = TradeTransactionSchema.pick({
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

export const isEqualTradeTransaction = (a: TradeTransaction) => (b: TradeTransaction) => isEqualBy(a, b, parseTradeTransactionUid)
