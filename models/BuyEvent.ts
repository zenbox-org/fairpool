import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { EventSchema } from '../../ethereum/models/Event'
import { AddressSchema } from '../../ethereum/models/Address'
import { AmountUint256BNSchema } from '../../ethereum/models/AmountUint256BN'
import { utils } from 'ethers'

export const BuyEventSchema = EventSchema.extend({
  sender: AddressSchema,
  baseDelta: AmountUint256BNSchema,
  quoteDelta: AmountUint256BNSchema,
}).describe('BuyEvent')

export const BuyEventUidSchema = BuyEventSchema.pick({

})

export const BuyEventsSchema = getArraySchema(BuyEventSchema, parseBuyEventUid)

export type BuyEvent = z.infer<typeof BuyEventSchema>

export type BuyEventUid = z.infer<typeof BuyEventUidSchema>

export function parseBuyEvent(event: BuyEvent): BuyEvent {
  return BuyEventSchema.parse(event)
}

export function parseBuyEvents(events: BuyEvent[]): BuyEvent[] {
  return BuyEventsSchema.parse(events)
}

export function parseBuyEventUid(eventUid: BuyEventUid): BuyEventUid {
  return BuyEventUidSchema.parse(eventUid)
}

export const isEqualBuyEvent = isEqualByDC(parseBuyEventUid)

// Buy(address indexed sender, uint baseDelta, uint quoteDelta);
export const BuyEventTopic = utils.id('Buy(address,uint256,uint256)')
