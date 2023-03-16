import { Address } from '../Address'

export interface ComplexShare {
  rootNumerator: bigint
  rootReferralNumerator: bigint
  rootDiscountNumerator: bigint
  referralsMap: Record<Address, Address>
  isRecognizedReferralMap: Record<Address, boolean>
}
