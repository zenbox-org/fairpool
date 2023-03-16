import { Address } from '../models/Address'
import { Asset } from '../models/Asset'
import { Fint } from '../models/Fint'

export const byAssetWallet = (asset: Asset, wallet: Address) => (fint: Fint) => fint.asset === asset && fint.wallet === wallet
