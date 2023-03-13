import { concat } from 'remeda'
import { assertByUnary } from '../../../utils/assert'
import { BigIntBasicArithmetic, BigIntBasicValidations } from '../../../utils/bigint/BigIntBasicArithmetic'
import { BigIntBasicOperations } from '../../../utils/bigint/BigIntBasicOperations'
import { GetTalliesDeltaConfig } from '../models/GetTalliesDeltaConfig'
import { HieroShare } from '../models/HieroShare'
import { TalliesDelta } from '../models/TalliesDelta'
import { Fairpool, GetTalliesDeltaParams } from '../uni'
import { getTalliesDeltasFromHolders } from './getTalliesDeltasFromHolders'
import { getTalliesDeltasFromRecipient } from './getTalliesDeltasFromRecipient'
import { getTalliesDeltasFromReferrals } from './getTalliesDeltasFromReferrals'
import { Address } from '../../../ethereum/models/Address'

const { mod } = BigIntBasicArithmetic
const { clampIn, getShare, getQuotientOf, sumAmounts } = BigIntBasicOperations
const { isValidQuotientSum } = BigIntBasicValidations

// const offset = c.getRandomNumber(Number(fairpool.seed))
// const step = c.getRandomNumber(Number(fairpool.seed))

export const getTalliesDeltasFromHieroShares = (fairpool: Fairpool, sender: Address, params: GetTalliesDeltaParams) => (shares: HieroShare[]) => (quoteDistributed: bigint): TalliesDelta[] => {
  const quotients = shares.map(l => l.quotient)
  assertByUnary(isValidQuotientSum)(quotients, 'quotients')
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
