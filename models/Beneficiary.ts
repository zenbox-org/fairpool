import { isEqualByD } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { AddressSchema } from '../../ethereum/models/Address'
import { AmountUint256BNSchema } from '../../ethereum/models/AmountUint256BN'

export const BeneficiarySchema = z.object({
  address: AddressSchema,
  share: AmountUint256BNSchema,
}).describe('Beneficiary')

export const BeneficiaryUidSchema = BeneficiarySchema.pick({
  address: true,
})

export const BeneficiariesSchema = getArraySchema(BeneficiarySchema, parseBeneficiaryUid)

export type Beneficiary = z.infer<typeof BeneficiarySchema>

export type BeneficiaryUid = z.infer<typeof BeneficiaryUidSchema>

export function parseBeneficiary(beneficiary: Beneficiary): Beneficiary {
  return BeneficiarySchema.parse(beneficiary)
}

export function parseBeneficiaries(beneficiarys: Beneficiary[]): Beneficiary[] {
  return BeneficiariesSchema.parse(beneficiarys)
}

export function parseBeneficiaryUid(beneficiaryUid: BeneficiaryUid): BeneficiaryUid {
  return BeneficiaryUidSchema.parse(beneficiaryUid)
}

export const isEqualBeneficiary = (a: Beneficiary) => (b: Beneficiary) => isEqualByD(a, b, parseBeneficiaryUid)
