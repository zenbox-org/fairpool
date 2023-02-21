import { z } from 'zod'
import { TransitionP } from '../../divide-and-conquer/Transition'
import { AmountBNSchema } from '../../ethereum/models/AmountBN'
import { parseState, State } from './models/State'
import { UserParamsSchema } from './models/UserParams'
import { getAddressFromIndex } from './utils/getAddressFromIndex'

export const CreateWalletSchema = UserParamsSchema.extend({
  amount: AmountBNSchema,
}).describe('CreateSession')

export type CreateWallet = z.infer<typeof CreateWalletSchema>

export const createWallet: TransitionP<CreateWallet, State> = (params) => async (state) => {
  const address = getAddressFromIndex(state.addressIndex++)
  state.wallets.push({
    ...params,
    address,
  })
  return parseState(state)
}
