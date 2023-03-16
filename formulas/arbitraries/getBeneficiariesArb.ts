import { Arbitrary } from 'fast-check/lib/types/check/arbitrary/definition/Arbitrary'
import { zip } from 'remeda'
import { Address } from '../models/Address'
import { Beneficiary } from '../models/Beneficiary'
import { getScaledValuesArb } from './getScaledValuesArb'

/**
 * @deprecated
 */
export const getBeneficiariesArb = (addresses: Address[]): Arbitrary<Beneficiary[]> => {
  return getScaledValuesArb(addresses.length).map(shares => {
    return zip(addresses, shares).map(([address, share]) => ({
      address,
      share,
    }))
  })
}
