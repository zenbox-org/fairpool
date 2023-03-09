import { getTalliesDeltasFromRecipientConfig } from '../models/GetTalliesDeltaConfig'
import { Fairpool, GetTalliesDeltaParams, TalliesDelta } from '../uni'

export const getTalliesDeltasFromRecipient = (config: getTalliesDeltasFromRecipientConfig) => (fairpool: Fairpool, params: GetTalliesDeltaParams) => (quoteDistributed: bigint): TalliesDelta[] => {
  return [{
    address: config.address,
    amount: quoteDistributed,
  }]
}
