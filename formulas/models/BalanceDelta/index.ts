import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { Uint256BigIntSchema } from '../../../../ethereum/models/Uint256BigInt'
import { AddressSchema } from '../Address'

export const BalanceDeltaSchema = z.object({
  address: AddressSchema,
  amount: Uint256BigIntSchema.gt(0n, 'Delta amount must be gte 0n'), // using an unsigned integer for amount delta because all amount deltas must be positive (only added)
}).describe('BalanceDelta')

export const BalanceDeltaUidSchema = BalanceDeltaSchema // allow repeating addresses

export const BalanceDeltasSchema = getArraySchema(BalanceDeltaSchema, parseBalanceDeltaUid)

export type BalanceDelta = z.infer<typeof BalanceDeltaSchema>

export type BalanceDeltaUid = z.infer<typeof BalanceDeltaUidSchema>

export function parseBalanceDelta(delta: BalanceDelta): BalanceDelta {
  return BalanceDeltaSchema.parse(delta)
}

export function parseBalanceDeltas(deltas: BalanceDelta[]): BalanceDelta[] {
  return BalanceDeltasSchema.parse(deltas)
}

export function parseBalanceDeltaUid(deltaUid: BalanceDeltaUid): BalanceDeltaUid {
  return BalanceDeltaUidSchema.parse(deltaUid)
}

export const isEqualBalanceDelta = isEqualByDC(parseBalanceDeltaUid)
