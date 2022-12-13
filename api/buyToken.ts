import { z } from 'zod'
import { bn } from '../../bn/utils'
import { ensureByIndex } from '../../utils/ensure'
import { TokenParamsSchema } from '../models/Token'
import { toFairpoolTransition } from '../toFairpoolTransition'
import { SessionParamsSchema } from './models/SessionParams'
import { getAddressFromIndex } from './utils/getAddressFromIndex'

export const BuyTokenSchema = SessionParamsSchema
  .merge(TokenParamsSchema)
  .describe('CreateToken')

export type CreateToken = z.infer<typeof BuyTokenSchema>

export function parseCreateToken(token: CreateToken): CreateToken {
  return BuyTokenSchema.parse(token)
}

export const buyToken = toFairpoolTransition(BuyTokenSchema)((params) => async (state) => {
  const { sessionId } = params
  const session = ensureByIndex(state.sessions, sessionId)
  const user = ensureByIndex(state.users, session.userId)
  const wallets = state.wallets.filter(w => w.userId === session.userId)
  const address = getAddressFromIndex(state.addressIndex++)
  if (!wallets.find(w => w.address === params.owner)) throw new Error('Token owner must be a user-owned wallet')
  state.tokens.push({
    ...params,
    address,
    decimals: bn(18),
    balances: [],
  })
  return state
})
