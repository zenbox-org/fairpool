import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { SellSchema } from '../../Action/BaseAction/Sell'
import { ShiftSchema } from '../index'

export const SellShiftSchema = ShiftSchema.extend({
  action: SellSchema,
}).describe('SellShift')

export const SellShiftUidSchema = SellShiftSchema.pick({

})

export const SellShiftsSchema = getArraySchema(SellShiftSchema, parseSellShiftUid)

export type SellShift = z.infer<typeof SellShiftSchema>

export type SellShiftUid = z.infer<typeof SellShiftUidSchema>

export function parseSellShift(shift: SellShift): SellShift {
  return SellShiftSchema.parse(shift)
}

export function parseSellShifts(shifts: SellShift[]): SellShift[] {
  return SellShiftsSchema.parse(shifts)
}

export function parseSellShiftUid(shiftUid: SellShiftUid): SellShiftUid {
  return SellShiftUidSchema.parse(shiftUid)
}

export const isEqualSellShift = isEqualByDC(parseSellShiftUid)
