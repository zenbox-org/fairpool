import { constantFrom, record, uniqueArray } from 'fast-check'
import { Address as EthAddress } from '../../../ethereum/models/Address'
import { addressArb } from '../../../ethereum/models/Address/addressArb'
import { fairpoolZero } from '../zero'
import { distributionParamsArb } from './distributionParamsArb'
import { getSharesArb } from './getSharesArb'
import { priceParamsArb } from './priceParamsArb'

export const getFairpoolArb = (contract: EthAddress, users: EthAddress[]) => record({
  priceParams: priceParamsArb,
  shares: getSharesArb(users)(1),
  owner: constantFrom(...users),
  operator: constantFrom(...users),
  distributionParams: distributionParamsArb,
}).map(fairpool => ({
  ...fairpoolZero,
  ...fairpool,
  address: contract,
  ...fairpool.priceParams,
  ...fairpool.distributionParams,
}))

export const getFairpoolZeroSharesArb = (contract: EthAddress, users: EthAddress[]) => getFairpoolArb(contract, users).map(f => ({
  ...f,
  shares: [],
}))

export const fairpoolArb = uniqueArray(addressArb, { minLength: 2, maxLength: 10 })
  .map(addresses => {
    const [contract, ...users] = addresses
    return getFairpoolZeroSharesArb(contract, users)
  })
