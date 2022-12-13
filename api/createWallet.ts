import { z } from 'zod'
import { Transition } from '../../divide-and-conquer/Transition'
import { parseState, State } from './models/State'
import { UserParamsSchema } from './models/UserParams'
import { getAddressFromIndex } from './utils/getAddressFromIndex'

export const CreateWalletSchema = UserParamsSchema.describe('CreateSession')

export type CreateWallet = z.infer<typeof CreateWalletSchema>

export const createWallet: Transition<CreateWallet, State> = ({ userId }) => async (state) => {
  const address = getAddressFromIndex(state.addressIndex++)
  state.wallets.push({
    address,
    userId,
  })
  return parseState(state)
}
