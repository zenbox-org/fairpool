import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { refineR } from '../../../../utils/bigint/BigIntAllRefinesR'
import { getAmountD } from '../../helpers/getAmount'
import { getTotalSupply } from '../../helpers/getTotalSupply'
import { BlockchainSchema } from '../Blockchain'
import { FairpoolsSchema } from '../Fairpool'

export const StateSchema = z.object({
  blockchain: BlockchainSchema,
  fairpools: FairpoolsSchema,
})
  .superRefine((state, ctx) => {
    const { blockchain, fairpools } = state
    fairpools.forEach(fairpool => {
      const quoteSupplyActual = fairpool.quoteSupply
      const quoteSupplyTallies = getTotalSupply(fairpool.tallies)
      const quoteAmountContractActual = getAmountD(fairpool.address)(blockchain.balances)
      const quoteAmountContractExpected = quoteSupplyActual + quoteSupplyTallies
      refineR.eq(ctx)(quoteAmountContractActual, quoteAmountContractExpected, 'quoteAmountContractActual', 'quoteAmountContractExpected', {}, 'Actual quote amount that is held by the contract should be equal to sum(tallies) + quoteSupply')
    })
  })
  .describe('State')

export const StateUidSchema = StateSchema

export const StatesSchema = getArraySchema(StateSchema, parseStateUid)

export type State = z.infer<typeof StateSchema>

export type StateUid = z.infer<typeof StateUidSchema>

export function parseState(state: State): State {
  return StateSchema.parse(state)
}

export function parseStates(states: State[]): State[] {
  return StatesSchema.parse(states)
}

export function parseStateUid(stateUid: StateUid): StateUid {
  return StateUidSchema.parse(stateUid)
}

export const isEqualState = isEqualByDC(parseStateUid)
