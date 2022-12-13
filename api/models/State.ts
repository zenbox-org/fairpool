import { intersection } from 'remeda'
import { z } from 'zod'
import { toAddresses } from '../../../ethereum/models/Address'
import { AssetsSchema } from '../../../finance/models/Asset'
import { TokensSchema } from '../../models/Token'
import { SessionsSchema } from './Session'
import { UsersSchema } from './User'
import { WalletsSchema } from './Wallet'

export const StateSchema = z.object({
  assets: AssetsSchema,
  tokens: TokensSchema,
  sessions: SessionsSchema,
  wallets: WalletsSchema,
  users: UsersSchema,
  addressIndex: z.number(),
})
  .refine(({ wallets, users }) => wallets.every(w => users[w.userId]), 'Wallet.userId must exist in Users')
  .refine(({ sessions, users }) => sessions.every(s => users[s.userId]), 'Session.userId must exist in Users')
  .refine(({ wallets, tokens }) => intersection(toAddresses(wallets), toAddresses(tokens)), 'Addresses must be unique')
  .refine(({ wallets, tokens }) => tokens.every(t => wallets.find(w => t.owner === w.address)), 'Token.owner must be a wallet address')
  .refine(({ wallets, tokens }) => tokens.every(t => t.beneficiaries.every(b => wallets.find(w => b.address === w.address))), 'Token.beneficiaries must be wallet addresses')
  .describe('State')

export type State = z.infer<typeof StateSchema>

export function parseState(state: State): State {
  return StateSchema.parse(state)
}
