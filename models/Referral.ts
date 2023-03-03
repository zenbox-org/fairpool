import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { AddressSchema, AddressUidSchema } from '../../ethereum/models/Address'

export const ReferralSchema = AddressSchema.describe('Referral')

export const ReferralUidSchema = AddressUidSchema

export const ReferralsSchema = getArraySchema(ReferralSchema, parseReferralUid)

export type Referral = z.infer<typeof ReferralSchema>

export type ReferralUid = z.infer<typeof ReferralUidSchema>

export function parseReferral(referral: Referral): Referral {
  return ReferralSchema.parse(referral)
}

export function parseReferrals(referrals: Referral[]): Referral[] {
  return ReferralsSchema.parse(referrals)
}

export function parseReferralUid(referralUid: ReferralUid): ReferralUid {
  return ReferralUidSchema.parse(referralUid)
}

export const isEqualReferral = isEqualByDC(parseReferralUid)
