import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { AddressSchema } from '../../../ethereum/models/Address'
import { AmountBNSchema } from '../../../ethereum/models/AmountBN'
import { IdxSchema } from '../../../generic/models/Idx'

export const WalletSchema = z.object({
  address: AddressSchema,
  amount: AmountBNSchema, // of native blockchain currency
  userId: IdxSchema,
}).describe('Wallet')

export const WalletUidSchema = WalletSchema.pick({
  address: true,
})

export const WalletsSchema = getArraySchema(WalletSchema, parseWalletUid)

export type Wallet = z.infer<typeof WalletSchema>

export type WalletUid = z.infer<typeof WalletUidSchema>

export function parseWallet(wallet: Wallet): Wallet {
  return WalletSchema.parse(wallet)
}

export function parseWallets(wallets: Wallet[]): Wallet[] {
  return WalletsSchema.parse(wallets)
}

export function parseWalletUid(walletUid: WalletUid): WalletUid {
  return WalletUidSchema.parse(walletUid)
}

export const isEqualWallet = isEqualByDC(parseWalletUid)
