import { z } from 'zod'
import { AmountPositiveBNSchema } from '../../ethereum/models/AmountPositiveBN'
import { IdxSchema } from '../../generic/models/Idx'
import { toFairpoolTransition } from '../toFairpoolTransition'
import { SessionParamsSchema } from './models/SessionParams'
import { getTokenInfo } from './utils/getWalletInfo'

export const BuyTokenSchema = SessionParamsSchema
  .extend({
    walletId: IdxSchema,
    tokenId: IdxSchema,
    amount: AmountPositiveBNSchema,
  })
  .describe('CreateToken')

export type CreateToken = z.infer<typeof BuyTokenSchema>

export function parseCreateToken(token: CreateToken): CreateToken {
  return BuyTokenSchema.parse(token)
}

export const buyToken = toFairpoolTransition(BuyTokenSchema)((params) => async (state) => {
  const { token, wallet, session, user } = getTokenInfo(params, state)
  const { amount } = params
  if (amount.gt(wallet.amount)) throw new Error('Cannot buy for higher amount than available on wallet')
  // TODO: sub wallet amount, add token wallet amount
  // TODO: change token balances
  // state.tokens.push({
  //   ...params,
  //   address,
  //   decimals: bn(18),
  //   balances: [],
  // })
  return state
})
