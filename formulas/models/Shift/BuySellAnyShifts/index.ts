import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { z } from 'zod'
import { ShiftSchema } from '../../Shift'
import { BuyShiftSchema } from '../BuyShift'
import { SellShiftSchema } from '../SellShift'

export const BuySellAnyShiftsSchema = z.tuple([BuyShiftSchema, SellShiftSchema, ShiftSchema]).describe('BuySellAnyShifts')

export const BuySellAnyShiftsArraySchema = getArraySchema(BuySellAnyShiftsSchema, identity)

export type BuySellAnyShifts = z.infer<typeof BuySellAnyShiftsSchema>

export const parseBuySellAnyShifts = (shifts: BuySellAnyShifts): BuySellAnyShifts => BuySellAnyShiftsSchema.parse(shifts)

export const parseBuySellAnyShiftsArray = (shiftsArray: BuySellAnyShifts[]): BuySellAnyShifts[] => BuySellAnyShiftsArraySchema.parse(shiftsArray)

export const isEqualBuySellAnyShifts = isEqualSC
