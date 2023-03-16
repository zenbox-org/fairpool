import { FintGen, FintGenTuple } from '../../../../finance/models/FintGen'
import { Address } from '../Address'
import { Amount } from '../Amount'
import { Asset } from '../Asset'

export type Fint = FintGen<Address, Asset, Amount>

export type FintTuple = FintGenTuple<Address, Asset, Amount>
