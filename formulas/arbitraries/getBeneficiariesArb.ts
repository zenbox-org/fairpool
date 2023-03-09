import { Arbitrary } from 'fast-check/lib/types/check/arbitrary/definition/Arbitrary'
import { zip } from 'remeda'
import { Address, Beneficiary } from '../uni'
import { getScaledValuesArb } from './getScaledValuesArb'

export const getBeneficiariesArb = (addresses: Address[]): Arbitrary<Beneficiary[]> => {
  return getScaledValuesArb(addresses.length).map(shares => {
    return zip(addresses, shares).map(([address, share]) => ({
      address,
      share,
    }))
  })
}
