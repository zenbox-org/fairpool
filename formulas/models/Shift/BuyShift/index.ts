import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { BuySchema } from '../../Action/BaseAction/Buy'
import { ShiftSchema } from '../index'

export const BuyShiftSchema = ShiftSchema.extend({
  action: BuySchema,
}).describe('BuyShift')

export const BuyShiftUidSchema = BuyShiftSchema.pick({

})

export const BuyShiftsSchema = getArraySchema(BuyShiftSchema, parseBuyShiftUid)

export type BuyShift = z.infer<typeof BuyShiftSchema>

export type BuyShiftUid = z.infer<typeof BuyShiftUidSchema>

export function parseBuyShift(shift: BuyShift): BuyShift {
  return BuyShiftSchema.parse(shift)
}

export function parseBuyShifts(shifts: BuyShift[]): BuyShift[] {
  return BuyShiftsSchema.parse(shifts)
}

export function parseBuyShiftUid(shiftUid: BuyShiftUid): BuyShiftUid {
  return BuyShiftUidSchema.parse(shiftUid)
}

export const isEqualBuyShift = isEqualByDC(parseBuyShiftUid)
