import { constantFrom, record, uniqueArray } from 'fast-check'
import { getAddressArbitrary } from '../../../ethereum/models/Address/getAddressArbitrary'
import { Address } from '../uni'
import { fairpoolZero } from '../zero'
import { distributionParamsArb } from './distributionParamsArb'
import { getBeneficiariesArb } from './getBeneficiariesArb'
import { priceParamsArb } from './priceParamsArb'

export const getFairpoolArb = (contract: Address, users: Address[]) => record({
  priceParams: priceParamsArb,
  beneficiaries: getBeneficiariesArb(users),
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

export const fairpoolArb = uniqueArray(getAddressArbitrary(), { minLength: 2, maxLength: 10 })
  .map(addresses => {
    const [contract, ...users] = addresses
    return getFairpoolArb(contract, users)
  })
