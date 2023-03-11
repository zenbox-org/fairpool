import { BigIntBasicOperations } from '../../../utils/bigint/BigIntBasicOperations'
import { GetTalliesDeltasFromReferralsConfig } from '../models/GetTalliesDeltaConfig'
import { TalliesDelta } from '../models/TalliesDelta'
import { Address, Fairpool, GetTalliesDeltaParams } from '../uni'

const { clampIn, getShare, getQuotientOf, sumAmounts } = BigIntBasicOperations

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
