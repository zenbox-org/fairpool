import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { every } from 'lodash-es'
import { identity } from 'remeda'
import { z } from 'zod'
import { isEqualBase } from '../../../../Action/isEqualBase'
import { getAmountBase } from '../../../../Amount/getAmount'
import { AnyBuySellShiftsSchema } from '../../AnyBuySellShifts'

export const BuySellCycleSchema = AnyBuySellShiftsSchema
  .superRefine((shifts, ctx) => {
    const [{ state: started }, { action: buy, state: bought }, { action: sell, state: sold }] = shifts
    const { contract, sender } = buy
    return every([
      isEqualBase(buy)(sell),
      getAmountBase(sender)(started) === getAmountBase(sender)(sold),
    ])
  })
  .describe('BuySellCycle')

export const BuySellCyclesSchema = getArraySchema(BuySellCycleSchema, identity)

export type BuySellCycle = z.infer<typeof BuySellCycleSchema>

export const parseBuySellCycle = (cycle: BuySellCycle): BuySellCycle => BuySellCycleSchema.parse(cycle)

export const parseBuySellCycles = (cycles: BuySellCycle[]): BuySellCycle[] => BuySellCyclesSchema.parse(cycles)

export const isEqualBuySellCycle = isEqualSC
