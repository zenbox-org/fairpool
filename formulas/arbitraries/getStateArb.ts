import { array, constant, record } from 'fast-check'
import { Address, State } from '../uni'
import { blockchainZero } from '../zero'
import { getFairpoolArb } from './getFairpoolArb'

export const getStateArb = (contract: Address, users: Address[]) => record<State>({
  fairpools: array(getFairpoolArb(contract, users), {
    minLength: 1,
    maxLength: 1,
  }),
  blockchain: constant(blockchainZero),
})
