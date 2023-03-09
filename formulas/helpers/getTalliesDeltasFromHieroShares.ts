import { concat } from 'remeda'
import { assertByUnary } from '../../../utils/assert'
import { BigIntBasicArithmetic, BigIntBasicOperations, BigIntBasicValidations } from '../../../utils/bigint/arithmetic'
import { GetTalliesDeltaConfig, GetTalliesDeltaFromHoldersConfig, getTalliesDeltasFromRecipientConfig } from '../models/GetTalliesDeltaConfig'
import { HieroShare } from '../models/HieroShare'
import { Fairpool, GetTalliesDeltaParams, TalliesDelta } from '../uni'
import { getTalliesDeltasFromHolders } from './getTalliesDeltasFromHolders'
import { getTalliesDeltasFromRecipient } from './getTalliesDeltasFromRecipient'

const { mod } = BigIntBasicArithmetic
const { clampIn, getShare, getQuotientOf, sumAmounts } = BigIntBasicOperations
const { isValidQuotientSum } = BigIntBasicValidations

// const offset = c.getRandomNumber(Number(fairpool.seed))
// const step = c.getRandomNumber(Number(fairpool.seed))

export const getTalliesDeltasFromHieroShares = (fairpool: Fairpool, params: GetTalliesDeltaParams) => (shares: HieroShare[]) => (quoteDistributed: bigint): TalliesDelta[] => {
  const quotients = shares.map(l => l.quotient)
  assertByUnary(isValidQuotientSum)(quotients, 'quotients')
  return shares.flatMap(({ getRecipientsConfig, quotient, children }) => {
    const quoteDistributedLocal = getQuotientOf(quotient)(quoteDistributed)
    const deltasChildren = getTalliesDeltasFromHieroShares(fairpool, params)(children)(quoteDistributedLocal)
    const quoteDistributedLocalToChildren = sumAmounts(deltasChildren)
    const quoteDistributedLocalToRecipients = quoteDistributedLocal - quoteDistributedLocalToChildren
    const deltasRecipients = getTalliesDeltasViaConfig(getRecipientsConfig)(fairpool, params)(quoteDistributedLocalToRecipients)
    return concat(deltasRecipients, deltasChildren)
  })
}

export const getTalliesDeltasViaConfig = (config: GetTalliesDeltaConfig) => {
  switch (config.type) {
    case 'GetTalliesDeltaFromHoldersConfig': return getTalliesDeltasFromHolders(config)
    case 'getTalliesDeltasFromRecipientConfig': return getTalliesDeltasFromRecipient(config)
    default: throw new Error()
  }
}
