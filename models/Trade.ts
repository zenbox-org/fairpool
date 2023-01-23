import { isEqualByD } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { TradeAmountSchema } from './TradeAmount'
import { TradeTransactionSchema } from './TradeTransaction'
import { AddressSchema } from '../../ethereum/models/Address'

/**
 * IMPORTANT: Trade is different from TradeEvent
 * - TradeEvent is a raw event from a smart contract
 * - Trade is a processed TradeEvent (more suitable for UI)
 *
 * baseDelta is positive -> trade is a buy
 * baseDelta is negative -> trade is a sell
 */
export const TradeSchema = TradeTransactionSchema.extend({
  sender: AddressSchema,
  baseDelta: TradeAmountSchema,
  quoteDelta: TradeAmountSchema,
}).describe('Trade')

export const TradeUidSchema = TradeTransactionSchema

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

export const isBuy = (trade: Trade) => !trade.baseDelta.isNegative()

export const isSell = (trade: Trade) => trade.baseDelta.isNegative()
