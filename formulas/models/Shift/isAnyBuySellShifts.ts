import { ZodParser } from '../../../../decimaker/models/Parser'
import { todo } from '../../../../utils/todo'
import { BuyShift, BuyShiftsSchema } from './BuyShift'
import { Shift } from './index'
import { SellShift } from './SellShift'

// class FairpoolError<T> extends CustomError<T> {}

// const failure = <T>(message: string, props: T) => ({ success: false, error: new FairpoolError<T>(message, props) })

type ShiftParser<Out> = ZodParser<Shift[], Out>

const isBuyShift: ShiftParser<BuyShift[]> = (shifts: Shift[]) => {
  return BuyShiftsSchema.safeParse(shifts)
}

export const isAnyBuySellShifts: ShiftParser<[Shift, BuyShift, SellShift]> = (shifts: Shift[]) => {
  return todo() // AnyBuySellShiftsSchema.safeParse(shifts)
}
