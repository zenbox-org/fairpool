import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { z } from 'zod'
import { BuyShiftSchema } from '../../BuyShift'
import { ShiftSchema } from '../../index'
import { SellShiftSchema } from '../../SellShift'

export const AnyBuySellShiftsSchema = z.tuple([ShiftSchema, BuyShiftSchema, SellShiftSchema]).describe('BuySellAnyShifts')

export const AnyBuySellShiftsArraySchema = getArraySchema(AnyBuySellShiftsSchema, identity)

export type AnyBuySellShifts = z.infer<typeof AnyBuySellShiftsSchema>

export const parseAnyBuySellShifts = (shifts: AnyBuySellShifts): AnyBuySellShifts => AnyBuySellShiftsSchema.parse(shifts)

export const parseAnyBuySellShiftsArray = (shiftsArray: AnyBuySellShifts[]): AnyBuySellShifts[] => AnyBuySellShiftsArraySchema.parse(shiftsArray)

export const isEqualAnyBuySellShifts = isEqualSC
