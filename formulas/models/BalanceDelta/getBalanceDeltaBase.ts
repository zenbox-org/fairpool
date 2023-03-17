import { Address } from '../../../../ethereum/models/Address'
import { todo } from '../../../../utils/todo'
import { State } from '../State'

export const getBalanceDeltaBase = (sender: Address) => (contract: Address) => (a: State, b: State) => todo()
