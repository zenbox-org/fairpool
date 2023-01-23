import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import * as $ from 'libs/ethereum/models/Event'
import { AddressSchema } from '../../ethereum/models/Address'
import { AmountUint256BNSchema } from '../../ethereum/models/AmountUint256BN'
import { utils } from 'ethers'

export const TradeEventSchema = $.EventSchema.extend({
  sender: AddressSchema,
  isBuy: z.boolean(),
  baseDelta: AmountUint256BNSchema,
  quoteDelta: AmountUint256BNSchema,
  quoteReceived: AmountUint256BNSchema,
}).describe('TradeEvent')

export const TradeEventUidSchema = $.EventUidSchema

export const TradeEventsSchema = getArraySchema(TradeEventSchema, parseTradeEventUid)

export type TradeEvent = z.infer<typeof TradeEventSchema>

export type TradeEventUid = z.infer<typeof TradeEventUidSchema>

export function parseTradeEvent(event: TradeEvent): TradeEvent {
  return TradeEventSchema.parse(event)
}

export function parseTradeEvents(events: TradeEvent[]): TradeEvent[] {
  return TradeEventsSchema.parse(events)
}

export function parseTradeEventUid(eventUid: TradeEventUid): TradeEventUid {
  return TradeEventUidSchema.parse(eventUid)
}

export const isEqualTradeEvent = isEqualByDC(parseTradeEventUid)

// Trade(address indexed sender, bool isBuy, uint baseDelta, uint quoteDelta, uint quoteReceived);
export const TradeEventTopic = utils.id('Trade(address,bool,uint256,uint256,uint256)')
