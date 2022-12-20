import { clone } from 'remeda'
import { z } from 'zod'
import { AmountPositiveBNSchema } from '../../ethereum/models/AmountPositiveBN'
import { IdxSchema } from '../../generic/models/Idx'
import { isEqualByD } from '../../utils/lodash'
import { getScale } from '../models/Token/getScale'
import { getTotalSupply } from '../models/Token/getTotalSupply'
import { toFairpoolTransition } from '../toFairpoolTransition'
import { SessionParamsSchema } from './models/SessionParams'
import { State, StateSchema } from './models/State'
import { getBaseFromQuote } from './utils/conversion'
import { getNativeTotalSupply } from './utils/getNativeTotalSupply'
import { getTokenInfo, getTokenTotalSupply } from './utils/getWalletInfo'
import { moveAmount } from './utils/moveAmount'
import { addBalance } from './utils/updateBalance'

export const BuyTokenSchema = SessionParamsSchema
  .extend({
    walletId: IdxSchema,
    tokenId: IdxSchema,
    quoteAmount: AmountPositiveBNSchema,
  })
  .describe('BuyToken')

export type BuyToken = z.infer<typeof BuyTokenSchema>

export function parseCreateToken(token: BuyToken): BuyToken {
  return BuyTokenSchema.parse(token)
}

export const BuyTokenValidationSchema = z.object({
  params: BuyTokenSchema,
  stateOld: StateSchema,
  stateNew: StateSchema,
})
  .refine(({ stateOld, stateNew }) => isEqualByD(stateOld, stateNew, getNativeTotalSupply))
  .refine(({ params, stateOld, stateNew }) => getTokenTotalSupply(params, stateOld).lt(getTokenTotalSupply(params, stateNew)))

export const buyToken = toFairpoolTransition(BuyTokenSchema)((params) => async (state) => {
  const { token, wallet, session, user } = getTokenInfo(params, state)
  const { quoteAmount } = params
  const { amount: quoteAmountCurrent } = wallet
  const stateOld = clone(state)
  if (quoteAmount.gt(quoteAmountCurrent)) throw new Error('Cannot buy for higher amount than available on wallet')
  moveAmount(quoteAmount, wallet, token)
  const quoteNew = token.amount
  const speed = token.speed
  const scale = getScale(token)
  const baseNew = getBaseFromQuote(quoteNew, speed, scale) // NOTE: this sqrt implementation may be different from Solidity sqrt implementation
  const baseOld = getTotalSupply(token)
  const baseDelta = baseNew.sub(baseOld)
  addBalance(token, wallet.address, baseDelta)
  return validateBuyToken(stateOld)(params)(state)
})

const validateBuyToken = (stateOld: State) => (params: BuyToken) => (state: State) => {
  return state
}
