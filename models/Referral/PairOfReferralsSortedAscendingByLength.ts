import { z } from 'zod'
import { compareArraysByLength } from '../../../generic/models/Array.comparators'
import { SchemaPairSorted } from '../../../generic/models/ArraySorted'
import { ReferralsSchema } from '../Referral'

export const SchemaPairOfReferralsSortedAscendingByLength = SchemaPairSorted(ReferralsSchema, compareArraysByLength)

export type PairOfReferralsSortedAscendingByLength = z.infer<typeof SchemaPairOfReferralsSortedAscendingByLength>
