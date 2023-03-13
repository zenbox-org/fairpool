import { Address as EthAddress } from '../../../../ethereum/models/Address'
import { Quotient } from '../../../../utils/Quotient'

export interface GetTalliesDeltasFromHoldersConfig {
  type: 'GetTalliesDeltasFromHoldersConfig'
}

export interface GetTalliesDeltasFromRecipientConfig {
  type: 'GetTalliesDeltasFromRecipientConfig'
  address: EthAddress
}

export interface GetTalliesDeltasFromReferralsConfig {
  type: 'GetTalliesDeltasFromReferralsConfig'
  discount: Quotient<bigint>
  referralsMap: Record<EthAddress, EthAddress>
  isRecognizedReferralMap: Record<EthAddress, boolean>
}

export type GetTalliesDeltaConfig = GetTalliesDeltasFromHoldersConfig | GetTalliesDeltasFromRecipientConfig | GetTalliesDeltasFromReferralsConfig

export const getTalliesDeltaConfigTypes: GetTalliesDeltaConfig['type'][] = [
  'GetTalliesDeltasFromHoldersConfig',
  'GetTalliesDeltasFromRecipientConfig',
  'GetTalliesDeltasFromHoldersConfig',
]
