import { uint256MaxN } from '../../../../ethereum/constants'
import { Address } from '../../../../ethereum/models/Address'
import { getTalliesDeltasFromReferrals } from '../../helpers/getTalliesDeltasFromReferrals'
import { Fairpool } from '../Fairpool'
import { zeroGetTalliesDeltaParams } from '../GetTalliesDeltaParams'
import { isHolder } from '../Holder/isHolder'
import { hasNonZeroTallyDelta } from '../TalliesDelta/hasNonZeroTallyDelta'
import { Share } from './index'

/**
 * This function name includes "Maybe" because if share.getTalliesDeltaConfig.type === 'GetTalliesDeltasFromHoldersConfig', then the user might lose money in a buy-sell cycle, or he might not (depending on random)
 * NOTE: This function assumes the address is a sender
 */
const isMaybeBeneficialShareForSender = (fairpool: Fairpool) => (sender: Address) => (share: Share) => {
  const { getTalliesDeltaConfig } = share
  switch (getTalliesDeltaConfig.type) {
    case 'GetTalliesDeltasFromSenderConfig': return true
    case 'GetTalliesDeltasFromHoldersConfig': return isHolder(fairpool)(sender) // potentially beneficial, depending on random distribution
    case 'GetTalliesDeltasFromRecipientConfig': return getTalliesDeltaConfig.address === sender
    case 'GetTalliesDeltasFromReferralsConfig': {
      const talliesDeltasPotential = getTalliesDeltasFromReferrals(getTalliesDeltaConfig)(fairpool, sender, zeroGetTalliesDeltaParams)(uint256MaxN)
      return hasNonZeroTallyDelta(sender)(talliesDeltasPotential)
    }
  }
}
