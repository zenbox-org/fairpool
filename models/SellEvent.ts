import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { EventSchema } from '../../ethereum/models/Event'
import { AddressSchema } from '../../ethereum/models/Address'
import { AmountUint256BNSchema } from '../../ethereum/models/AmountUint256BN'
import { utils } from 'ethers'

export const SellEventSchema = EventSchema.extend({
  sender: AddressSchema,
  baseDelta: AmountUint256BNSchema,
  quoteDelta: AmountUint256BNSchema,
  quoteReceived: AmountUint256BNSchema,
}).describe('SellEvent')

export const SellEventUidSchema = SellEventSchema.pick({

})

export const SellEventsSchema = getArraySchema(SellEventSchema, parseSellEventUid)

export type SellEvent = z.infer<typeof SellEventSchema>

export type SellEventUid = z.infer<typeof SellEventUidSchema>

export function parseSellEvent(event: SellEvent): SellEvent {
  return SellEventSchema.parse(event)
}

export function parseSellEvents(events: SellEvent[]): SellEvent[] {
  return SellEventsSchema.parse(events)
}

export function parseSellEventUid(eventUid: SellEventUid): SellEventUid {
  return SellEventUidSchema.parse(eventUid)
}

export const isEqualSellEvent = isEqualByDC(parseSellEventUid)

// Sell(address indexed sender, uint baseDelta, uint quoteDelta, uint quoteReceived)
export const SellTopic = utils.id('Sell(address,uint256,uint256,uint256)')
