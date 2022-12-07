import { z } from 'zod'
import { getArraySchema } from 'zenbox-util/zod'
import { isEqualByD } from 'zenbox-util/lodash'
import { TassetSchema } from '../../finance/models/Tasset'
import { TradeAmountSchema } from './TradeAmount'
import { TradeTransactionSchema, TradeTransactionUidSchema } from './TradeTransaction'

/**
 * baseAmount is positive -> trade is a buy
 * baseAmount is negative -> trade is a sell
 */
export const TradeSchema = z.object({
  baseTasset: TassetSchema,
  quoteTasset: TassetSchema,
  baseAmount: TradeAmountSchema,
  quoteAmount: TradeAmountSchema,
  transaction: TradeTransactionSchema,
}).describe('Trade')

export const TradeUidSchema = z.object({
  transaction: TradeTransactionUidSchema,
})

export const TradesSchema = getArraySchema(TradeSchema, parseTradeUid)

export type Trade = z.infer<typeof TradeSchema>

export type TradeUid = z.infer<typeof TradeUidSchema>

export function parseTrade(trade: Trade): Trade {
  return TradeSchema.parse(trade)
}

export function parseTrades(trades: Trade[]): Trade[] {
  return TradesSchema.parse(trades)
}

export function parseTradeUid(tradeUid: TradeUid): TradeUid {
  return TradeUidSchema.parse(tradeUid)
}

export const isEqualTrade = (a: Trade) => (b: Trade) => isEqualByD(a, b, parseTradeUid)

export const isBuy = (trade: Trade) => !isSell(trade)

export const isSell = (trade: Trade) => trade.baseAmount.isNegative()
