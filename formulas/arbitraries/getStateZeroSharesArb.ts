import { array, constant, record } from 'fast-check'
import { Address as EthAddress } from '../../../ethereum/models/Address'
import { State } from '../uni'
import { blockchainZero } from '../zero'
import { getFairpoolZeroSharesArb } from './getFairpoolZeroSharesArb'

export const getStateZeroSharesArb = (contract: EthAddress, users: EthAddress[]) => record<State>({
  fairpools: array(getFairpoolZeroSharesArb(contract, users), {
    minLength: 1,
    maxLength: 1,
  }),
  blockchain: constant(blockchainZero),
})
