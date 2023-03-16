import { contract, usersDefault } from '../default'
import { getStateZeroSharesArb } from './getStateZeroSharesArb'

export const stateArb = getStateZeroSharesArb(contract, usersDefault)
