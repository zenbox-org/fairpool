import { Quotient } from '../../../../utils/Quotient'
import { Address } from '../../uni'

export interface GetTalliesDeltasFromHoldersConfig {
  type: 'GetTalliesDeltasFromHoldersConfig'
}

export interface GetTalliesDeltasFromRecipientConfig {
  type: 'GetTalliesDeltasFromRecipientConfig'
  address: Address
}

export interface GetTalliesDeltasFromReferralsConfig {
  type: 'GetTalliesDeltasFromReferralsConfig'
  discount: Quotient<bigint>
  referralsMap: Record<Address, Address>
  isRecognizedReferralMap: Record<Address, boolean>
}

export type GetTalliesDeltaConfig = GetTalliesDeltasFromHoldersConfig | GetTalliesDeltasFromRecipientConfig | GetTalliesDeltasFromReferralsConfig

export const getTalliesDeltaConfigTypes: GetTalliesDeltaConfig['type'][] = [
  'GetTalliesDeltasFromHoldersConfig',
  'GetTalliesDeltasFromRecipientConfig',
  'GetTalliesDeltasFromHoldersConfig',
]
