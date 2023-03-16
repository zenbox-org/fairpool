import { isEqualBy, isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { literal, z } from 'zod'
import { Uint256BigIntSchema } from '../../../../ethereum/models/Uint256BigInt'
import { refineTwoR } from '../../../../utils/assert'
import { refineR } from '../../../../utils/bigint/BigIntAllRefinesR'
import { getBaseSupplyF, getQuoteSupplyF } from '../../helpers/getSupply'
import { getTotalSupply } from '../../helpers/getTotalSupply'
import { AddressSchema } from '../Address'
import { AmountSchema } from '../Amount'
import { BalancesSchema } from '../Balance'
import { RawPriceParamsSchema, RawPriceParamsSuperRefine } from '../PriceParams'
import { SharesSchema } from '../Share'
import { holdersPerDistributionMaxFixed, scaleFixed, sharesLengthMax } from './constants'

export const RawFairpoolSchema = z.object({
  address: AddressSchema,
  balances: BalancesSchema, // in base currency
  tallies: BalancesSchema, // in quote currency
  quoteSupply: AmountSchema,
  scale: literal(scaleFixed),
  seed: Uint256BigIntSchema,
  shares: SharesSchema,
  // shares: SimpleShare[]
  // controllers: SimpleController[]
  // recipients: Address[]
  owner: AddressSchema,
  operator: AddressSchema,
  holdersPerDistributionMax: literal(holdersPerDistributionMaxFixed),
})

export type RawFairpool = z.infer<typeof RawFairpoolSchema>

export const FairpoolSchema = z.object({})
  .merge(RawPriceParamsSchema)
  .merge(RawFairpoolSchema)
  .superRefine(RawPriceParamsSuperRefine)
  .superRefine((fairpool, ctx) => {
    const { scale, shares, holdersPerDistributionMax, balances, quoteSupply } = fairpool
    const baseSupplyActual = getTotalSupply(balances)
    const quoteSupplyActual = quoteSupply
    const baseSupplyExpected = getBaseSupplyF(fairpool)(quoteSupplyActual)
    const quoteSupplyExpected = getQuoteSupplyF(fairpool)(baseSupplyActual)
    // refine.(denominators)) ctx.addIssue({ code: 'custom', message: 'assert(every(eq(scale))(shares.map(s => s.quotient.denominator))))' })
    refineR.lte(ctx)(holdersPerDistributionMax, BigInt(Number.MAX_SAFE_INTEGER), 'holdersPerDistributionMax', 'BigInt(Number.MAX_SAFE_INTEGER)', {}, 'Required for range() in getTalliesDelta()')
    refineR.gte(ctx)(baseSupplyActual, baseSupplyExpected, 'baseSupplyActual', 'baseSupplyExpected', {}, 'baseSupply* must be gte, not eq, because they are calculated imprecisely from quoteSupply')
    refineR.eq(ctx)(quoteSupplyActual, quoteSupplyExpected, 'quoteSupplyActual', 'quoteSupplyExpected', {}, 'quoteSupply* must be eq, not lte, because they are calculated precisely from baseSupply')
    refineR.lte(ctx)(BigInt(shares.length), BigInt(sharesLengthMax), 'shares.length', 'sharesLengthMax')
    // const denominators = shares.map(s => s.quotient.denominator)
    // assertOne(every(eq(scale)), 'every(eq(scale))')(denominators, 'denominators')
    refineTwoR(isEqualBy(v => v === 0n), 'isEqualBy(eq(zero))')(ctx)(baseSupplyActual, quoteSupplyActual, 'baseSupplyActual', 'quoteSupplyActual') // isZero(baseSupplyActual) === isZero(quoteSupplyActual)
  })
  .describe('Fairpool')

export const FairpoolUidSchema = z.object({
  address: AddressSchema,
})

export type Fairpool = z.infer<typeof FairpoolSchema>

export type FairpoolUid = z.infer<typeof FairpoolUidSchema>

export const FairpoolsSchema = getArraySchema(FairpoolSchema, parseFairpoolUid)

export function parseFairpool(fairpool: Fairpool): Fairpool {
  return FairpoolSchema.parse(fairpool)
}

export function parseFairpools(fairpools: Fairpool[]): Fairpool[] {
  return FairpoolsSchema.parse(fairpools)
}

export function parseFairpoolUid(fairpoolUid: FairpoolUid): FairpoolUid {
  return FairpoolUidSchema.parse(fairpoolUid)
}

export const isEqualFairpool = isEqualByDC(parseFairpoolUid)

export const isFairpool = (value: unknown): value is Fairpool => FairpoolSchema.safeParse(value).success
