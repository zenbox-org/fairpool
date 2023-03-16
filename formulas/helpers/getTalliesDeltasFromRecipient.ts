import { Address } from '../models/Address'
import { Fairpool } from '../models/Fairpool'
import { GetTalliesDeltasFromRecipientConfig } from '../models/GetTalliesDeltaConfig/GetTalliesDeltasFromRecipientConfig'
import { GetTalliesDeltaParams } from '../models/GetTalliesDeltaParams'
import { TalliesDelta } from '../models/TalliesDelta'

export const getTalliesDeltasFromRecipient = (config: GetTalliesDeltasFromRecipientConfig) => (fairpool: Fairpool, sender: Address, params: GetTalliesDeltaParams) => (quoteDistributed: bigint): TalliesDelta[] => {
  return [{
    address: config.address,
    amount: quoteDistributed,
  }]
}
