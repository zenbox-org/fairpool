import { array, constant, record } from 'fast-check'
import { Address, State } from '../uni'
import { blockchainZero } from '../zero'
import { getFairpoolZeroSharesArb } from './getFairpoolZeroSharesArb'

export const getStateZeroSharesArb = (contract: Address, users: Address[]) => record<State>({
  fairpools: array(getFairpoolZeroSharesArb(contract, users), {
    minLength: 1,
    maxLength: 1,
  }),
  blockchain: constant(blockchainZero),
})
