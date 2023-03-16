import { isEqualByDC } from 'libs/utils/lodash'
import { z } from 'zod'
import { refineOne } from '../../../../utils/assert'
import { sumLteOne } from '../../../../utils/Quotient/QuotientBigInt/QuotientBigIntSumComparators'
import { QuotientBigNatSchema } from '../../../../utils/Quotient/QuotientBigNat'
import { getDuplicatesRefinement, getSchemaDescription } from '../../../../utils/zod'
import { sharesLengthMax } from '../Fairpool/constants'
import { GetTalliesDeltaConfigSchema } from '../GetTalliesDeltaConfig'
import { ShareNameSchema } from '../ShareName'

const BaseHieroShareSchema = z.object({
  name: ShareNameSchema,
  quotient: QuotientBigNatSchema,
  getTalliesDeltaConfig: GetTalliesDeltaConfigSchema,
})

export type HieroShare = z.infer<typeof BaseHieroShareSchema> & {
  children: HieroShare[];
};

/**
 * TODO: Fix the type signature of HieroShareSchema
 */
export const HieroShareSchema: z.ZodType<HieroShare> = BaseHieroShareSchema.extend({
  children: z.lazy(() => HieroSharesSchema),
})
  .describe('HieroShare')

export const HieroShareUidSchema = BaseHieroShareSchema.pick({
  name: true,
})

export const HieroSharesSchema = HieroShareSchema.array()
  .max(sharesLengthMax)
  .superRefine(getDuplicatesRefinement(getSchemaDescription(HieroShareSchema), parseHieroShareUid))
  .superRefine((shares, ctx) => {
    const quotients = shares.map(s => s.quotient)
    refineOne(ctx)(sumLteOne)(quotients, 'quotients')
  })

export type HieroShareUid = z.infer<typeof HieroShareUidSchema>

export function parseHieroShare(share: HieroShare): HieroShare {
  return HieroShareSchema.parse(share)
}

export function parseHieroShares(shares: HieroShare[]): HieroShare[] {
  return HieroSharesSchema.parse(shares)
}

export function parseHieroShareUid(shareUid: HieroShareUid): HieroShareUid {
  return HieroShareUidSchema.parse(shareUid)
}

export const isEqualHieroShare = isEqualByDC(parseHieroShareUid)
