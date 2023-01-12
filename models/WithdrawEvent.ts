import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { EventSchema } from '../../ethereum/models/Event'
import { AddressSchema } from '../../ethereum/models/Address'
import { utils } from 'ethers'
import { AmountUint256BNSchema } from '../../ethereum/models/AmountUint256BN'

export const WithdrawEventSchema = EventSchema.extend({
  sender: AddressSchema,
  quoteReceived: AmountUint256BNSchema,
}).describe('WithdrawEvent')

export const WithdrawEventUidSchema = WithdrawEventSchema.pick({

})

export const WithdrawEventsSchema = getArraySchema(WithdrawEventSchema, parseWithdrawEventUid)

export type WithdrawEvent = z.infer<typeof WithdrawEventSchema>

export type WithdrawEventUid = z.infer<typeof WithdrawEventUidSchema>

export function parseWithdrawEvent(event: WithdrawEvent): WithdrawEvent {
  return WithdrawEventSchema.parse(event)
}

export function parseWithdrawEvents(events: WithdrawEvent[]): WithdrawEvent[] {
  return WithdrawEventsSchema.parse(events)
}

export function parseWithdrawEventUid(eventUid: WithdrawEventUid): WithdrawEventUid {
  return WithdrawEventUidSchema.parse(eventUid)
}

export const isEqualWithdrawEvent = isEqualByDC(parseWithdrawEventUid)

// Withdraw(address indexed sender, uint quoteReceived)
export const WithdrawTopic = utils.id('Withdraw(address,uint256)')
