import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByD } from 'libs/utils/lodash'
import { BN } from '../../bn'

export const TradeAmountSchema = z.instanceof(BN)
  .refine(a => !a.isZero(), 'Trade amount cannot be zero')
  .describe('TradeAmount')

export const TradeAmountUidSchema = TradeAmountSchema

export const TradeAmountsSchema = getArraySchema(TradeAmountSchema, parseTradeAmountUid)

export type TradeAmount = z.infer<typeof TradeAmountSchema>

export type TradeAmountUid = z.infer<typeof TradeAmountUidSchema>

export function parseTradeAmount(amount: TradeAmount): TradeAmount {
  return TradeAmountSchema.parse(amount)
}

export function parseTradeAmounts(amounts: TradeAmount[]): TradeAmount[] {
  return TradeAmountsSchema.parse(amounts)
}

export function parseTradeAmountUid(amountUid: TradeAmountUid): TradeAmountUid {
  return TradeAmountUidSchema.parse(amountUid)
}

export const isEqualTradeAmount = (a: TradeAmount) => (b: TradeAmount) => isEqualByD(a, b, parseTradeAmountUid)
