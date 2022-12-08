import { isEqualByD } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { BN } from '../../bn'

export const VolumeAmountSchema = z.instanceof(BN)
  .refine(a => !a.isNegative(), 'Volume amount cannot be negative')
  .describe('VolumeAmount')

export const VolumeAmountUidSchema = VolumeAmountSchema

export const VolumeAmountsSchema = getArraySchema(VolumeAmountSchema, parseVolumeAmountUid)

export type VolumeAmount = z.infer<typeof VolumeAmountSchema>

export type VolumeAmountUid = z.infer<typeof VolumeAmountUidSchema>

export function parseVolumeAmount(amount: VolumeAmount): VolumeAmount {
  return VolumeAmountSchema.parse(amount)
}

export function parseVolumeAmounts(amounts: VolumeAmount[]): VolumeAmount[] {
  return VolumeAmountsSchema.parse(amounts)
}

export function parseVolumeAmountUid(amountUid: VolumeAmountUid): VolumeAmountUid {
  return VolumeAmountUidSchema.parse(amountUid)
}

export const isEqualVolumeAmount = (a: VolumeAmount) => (b: VolumeAmount) => isEqualByD(a, b, parseVolumeAmountUid)
