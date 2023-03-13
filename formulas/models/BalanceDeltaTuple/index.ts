import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { BalanceDeltaSchema } from '../BalanceDelta'

export const BalanceDeltaTupleSchema = z.tuple([BalanceDeltaSchema.shape.address, BalanceDeltaSchema.shape.amount])
  .describe('BalanceDeltaTuple')

export const BalanceDeltaTupleUidSchema = BalanceDeltaTupleSchema // allow repeating addresses

export const BalanceDeltaTuplesSchema = getArraySchema(BalanceDeltaTupleSchema, parseBalanceDeltaTupleUid)

export type BalanceDeltaTuple = z.infer<typeof BalanceDeltaTupleSchema>

export type BalanceDeltaTupleUid = z.infer<typeof BalanceDeltaTupleUidSchema>

export function parseBalanceDeltaTuple(tuple: BalanceDeltaTuple): BalanceDeltaTuple {
  return BalanceDeltaTupleSchema.parse(tuple)
}

export function parseBalanceDeltaTuples(tuples: BalanceDeltaTuple[]): BalanceDeltaTuple[] {
  return BalanceDeltaTuplesSchema.parse(tuples)
}

export function parseBalanceDeltaTupleUid(tupleUid: BalanceDeltaTupleUid): BalanceDeltaTupleUid {
  return BalanceDeltaTupleUidSchema.parse(tupleUid)
}

export const isEqualBalanceDeltaTuple = isEqualByDC(parseBalanceDeltaTupleUid)
