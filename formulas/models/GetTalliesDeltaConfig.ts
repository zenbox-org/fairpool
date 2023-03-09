import { Address } from '../uni'

export interface GetTalliesDeltaFromHoldersConfig {
  type: 'GetTalliesDeltaFromHoldersConfig'
}

export interface getTalliesDeltasFromRecipientConfig {
  type: 'getTalliesDeltasFromRecipientConfig'
  address: Address
}

export type GetTalliesDeltaConfig = GetTalliesDeltaFromHoldersConfig | getTalliesDeltasFromRecipientConfig
