import { constant, constantFrom, record, uniqueArray } from 'fast-check'
import { addressArb } from '../../../ethereum/models/Address/addressArb'
import { todo } from '../../../utils/todo'
import { Address as Address } from '../models/Address'
import { parseFairpool } from '../models/Fairpool'
import { arst } from '../zero'
import { distributionParamsArb } from './distributionParamsArb'
import { priceParamsArb } from './priceParamsArb'

export const getFairpoolArb = (contract: Address, users: Address[]) => record({
  priceParams: priceParamsArb,
  shares: todo(constant([])), // getSharesArb(users)(1),
  owner: constantFrom(...users),
  operator: constantFrom(...users),
  distributionParams: distributionParamsArb,
}).map(fairpool => parseFairpool({
  ...arst,
  ...fairpool,
  address: contract,
  ...fairpool.priceParams,
  ...fairpool.distributionParams,
}))

export const getFairpoolZeroSharesArb = (contract: Address, users: Address[]) => getFairpoolArb(contract, users).map(f => ({
  ...f,
  shares: [],
}))

export const fairpoolArb = uniqueArray(addressArb, { minLength: 2, maxLength: 10 })
  .map(addresses => {
    const [contract, ...users] = addresses
    return getFairpoolZeroSharesArb(contract, users)
  })
