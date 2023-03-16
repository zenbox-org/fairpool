import { BigIntAdvancedOperations } from '../../../utils/bigint/BigIntAdvancedOperations'
import { Address } from '../models/Address'
import { Fairpool } from '../models/Fairpool'
import { GetTalliesDeltasFromReferralsConfig } from '../models/GetTalliesDeltaConfig/GetTalliesDeltasFromReferralsConfig'
import { GetTalliesDeltaParams } from '../models/GetTalliesDeltaParams'
import { TalliesDelta } from '../models/TalliesDelta'

const { clampIn, getShare, getQuotientOf, sumAmounts } = BigIntAdvancedOperations

export const getTalliesDeltasFromReferrals = (config: GetTalliesDeltasFromReferralsConfig) => (fairpool: Fairpool, sender: Address, params: GetTalliesDeltaParams) => (quoteDistributed: bigint): TalliesDelta[] => {
  const { discount, referralsMap } = config
  const referral = referralsMap[sender]
  if (referral) {
    const quoteDistributedToSender = getQuotientOf(discount)(quoteDistributed)
    const quoteDistributedToReferral = quoteDistributed - quoteDistributedToSender
    return [
      {
        address: sender,
        amount: quoteDistributedToSender,
      },
      {
        address: referral,
        amount: quoteDistributedToReferral,
      },
    ]
  } else {
    /* no referral - no discount // (quoteDistributedToReferral == 0n) -> (quoteDistributedToSender == 0n) */
    return []
  }
}
