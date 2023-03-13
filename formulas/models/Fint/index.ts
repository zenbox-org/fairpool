import { FintGen, FintGenTuple } from '../../../../finance/models/FintGen'
import { Address } from '../../../../ethereum/models/Address'
import { Asset } from '../Asset'
import { Amount } from '../Amount'

export type Fint = FintGen<Address, Asset, Amount>

export type FintTuple = FintGenTuple<Address, Asset, Amount>
