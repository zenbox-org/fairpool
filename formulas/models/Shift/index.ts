import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { ActionSchema } from '../Action'
import { StateSchema } from '../State'

export const ShiftSchema = z.object({
  state: StateSchema,
  action: ActionSchema,
}).describe('Shift')

export const ShiftUidSchema = ShiftSchema.pick({

})

export const ShiftsSchema = getArraySchema(ShiftSchema, parseShiftUid)

export type Shift = z.infer<typeof ShiftSchema>

export type ShiftUid = z.infer<typeof ShiftUidSchema>

export function parseShift(shift: Shift): Shift {
  return ShiftSchema.parse(shift)
}

export function parseShifts(shifts: Shift[]): Shift[] {
  return ShiftsSchema.parse(shifts)
}

export function parseShiftUid(shiftUid: ShiftUid): ShiftUid {
  return ShiftUidSchema.parse(shiftUid)
}

export const isEqualShift = isEqualByDC(parseShiftUid)
