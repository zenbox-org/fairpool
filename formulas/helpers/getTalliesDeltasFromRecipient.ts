import { GetTalliesDeltasFromRecipientConfig } from '../models/GetTalliesDeltaConfig'
import { TalliesDelta } from '../models/TalliesDelta'
import { Address, Fairpool, GetTalliesDeltaParams } from '../uni'

export const getTalliesDeltasFromRecipient = (config: GetTalliesDeltasFromRecipientConfig) => (fairpool: Fairpool, sender: Address, params: GetTalliesDeltaParams) => (quoteDistributed: bigint): TalliesDelta[] => {
  return [{
    address: config.address,
    amount: quoteDistributed,
  }]
}
