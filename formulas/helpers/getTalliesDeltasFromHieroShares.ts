import { concat } from 'remeda'
import { BigIntAdvancedOperations } from '../../../utils/bigint/BigIntAdvancedOperations'
import { BigIntBasicArithmetic } from '../../../utils/bigint/BigIntBasicArithmetic'
import { Address } from '../models/Address'
import { Fairpool } from '../models/Fairpool'
import { GetTalliesDeltaConfig } from '../models/GetTalliesDeltaConfig'
import { GetTalliesDeltaParams } from '../models/GetTalliesDeltaParams'
import { HieroShare } from '../models/HieroShare'
import { TalliesDelta } from '../models/TalliesDelta'
import { getTalliesDeltasFromHolders } from './getTalliesDeltasFromHolders'
import { getTalliesDeltasFromRecipient } from './getTalliesDeltasFromRecipient'
import { getTalliesDeltasFromReferrals } from './getTalliesDeltasFromReferrals'

const { mod } = BigIntBasicArithmetic
const { clampIn, getShare, getQuotientOf, sumAmounts } = BigIntAdvancedOperations

// const offset = c.getRandomNumber(Number(fairpool.seed))
// const step = c.getRandomNumber(Number(fairpool.seed))

export const getTalliesDeltasFromHieroShares = (fairpool: Fairpool, sender: Address, params: GetTalliesDeltaParams) => (shares: HieroShare[]) => (quoteDistributed: bigint): TalliesDelta[] => {
  return shares.flatMap(({ getTalliesDeltaConfig, quotient, children }) => {
    const quoteDistributedLocal = getQuotientOf(quotient)(quoteDistributed)
    const deltasChildren = getTalliesDeltasFromHieroShares(fairpool, sender, params)(children)(quoteDistributedLocal)
    const quoteDistributedLocalToChildren = sumAmounts(deltasChildren)
    const quoteDistributedLocalToRecipients = quoteDistributedLocal - quoteDistributedLocalToChildren
    const deltasRecipients = getTalliesDeltasViaConfig(getTalliesDeltaConfig)(fairpool, sender, params)(quoteDistributedLocalToRecipients)
    return concat(deltasRecipients, deltasChildren)
  })
}

export const getTalliesDeltasViaConfig = (config: GetTalliesDeltaConfig) => {
  switch (config.type) {
    case 'GetTalliesDeltasFromHoldersConfig': return getTalliesDeltasFromHolders(config)
    case 'GetTalliesDeltasFromRecipientConfig': return getTalliesDeltasFromRecipient(config)
    case 'GetTalliesDeltasFromReferralsConfig': return getTalliesDeltasFromReferrals(config)
    default: throw new Error()
  }
}
