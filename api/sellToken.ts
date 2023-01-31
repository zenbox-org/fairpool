import { z } from 'zod'
import { subUint } from '../../ethereum/math'
import { AmountPositiveBNSchema } from '../../ethereum/models/AmountPositiveBN'
import { IdxSchema } from '../../generic/models/Idx'
import { getTotalSupply } from '../models/Token/getTotalSupply'
import { toFairpoolTransition } from '../toFairpoolTransition'
import { SessionParamsSchema } from './models/SessionParams'
import { getTokenInfo } from './utils/getWalletInfo'
import { subBalance } from './utils/updateBalance'

export const SellTokenSchema = SessionParamsSchema
  .extend({
    walletId: IdxSchema,
    tokenId: IdxSchema,
    baseAmount: AmountPositiveBNSchema,
  })
  .describe('SellToken')

export type SellToken = z.infer<typeof SellTokenSchema>

export const buyToken = toFairpoolTransition(SellTokenSchema)((params) => async (state) => {
  const { balance, token, wallet, session, user } = getTokenInfo(params, state)
  const { baseAmount } = params
  const { amount: baseAmountCurrent } = balance
  if (baseAmount.gt(baseAmountCurrent)) throw new Error('Cannot sell higher amount than available on balance')
  // incrementBalance(token, wallet.address, baseDelta)
  // moveAmount(amount, wallet, token)
  const baseOld = getTotalSupply(token)
  const baseNew = subUint(baseOld, baseAmount)
  const quoteOld = token.amount
  // TODO:
  // const quoteNew = getQuoteFromBase(baseNew, token.speed, getScale(token))
  subBalance(token, wallet.address, baseAmount)
  return state
})
