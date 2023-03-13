import { GetTalliesDeltasFromRecipientConfig } from '../models/GetTalliesDeltaConfig'
import { TalliesDelta } from '../models/TalliesDelta'
import { Fairpool, GetTalliesDeltaParams } from '../uni'
import { Address } from '../../../ethereum/models/Address'

export const getTalliesDeltasFromRecipient = (config: GetTalliesDeltasFromRecipientConfig) => (fairpool: Fairpool, sender: Address, params: GetTalliesDeltaParams) => (quoteDistributed: bigint): TalliesDelta[] => {
  return [{
    address: config.address,
    amount: quoteDistributed,
  }]
}
