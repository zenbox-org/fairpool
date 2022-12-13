import { z } from 'zod'
import { addUint, subUint } from '../../ethereum/math'
import { AmountBN } from '../../ethereum/models/AmountBN'
import { AmountPositiveBNSchema } from '../../ethereum/models/AmountPositiveBN'
import { BalanceUint256BN } from '../../ethereum/models/BalanceUint256BN'
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

function moveAmount(amount: AmountBN, from: BalanceUint256BN, to: BalanceUint256BN) {
  from.amount = subUint(from.amount, amount)
  to.amount = addUint(to.amount, amount)
}

export const buyToken = toFairpoolTransition(BuyTokenSchema)((params) => async (state) => {
  const { token, wallet, session, user } = getTokenInfo(params, state)
  const { amount } = params
  if (amount.gt(wallet.amount)) throw new Error('Cannot buy for higher amount than available on wallet')
  moveAmount(amount, wallet, token)
  const quoteNew = token.amount
  // uint quoteAmount = address(this).balance;
  // uint baseAmount = totalSupply();
  // uint quoteFinal = quoteAmount + quoteDelta;
  // uint baseFinal = (quoteFinal.sqrt() * scale) / speed;
  // return baseFinal - baseAmount;
  // TODO: change token balances
  // state.tokens.push({
  //   ...params,
  //   address,
  //   decimals: bn(18),
  //   balances: [],
  // })
  return state
})
