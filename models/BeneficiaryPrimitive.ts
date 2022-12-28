import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { AddressSchema } from '../../ethereum/models/Address'
import { AmountBNPrimitiveSchema } from '../../ethereum/models/AmountBNPrimitive'

export const BeneficiaryPrimitiveSchema = z.object({
  address: AddressSchema,
  share: AmountBNPrimitiveSchema,
}).describe('BeneficiaryPrimitive')

export const BeneficiaryPrimitiveUidSchema = BeneficiaryPrimitiveSchema.pick({

})

export const BeneficiariesPrimitiveSchema = getArraySchema(BeneficiaryPrimitiveSchema, parseBeneficiaryPrimitiveUid)

export type BeneficiaryPrimitive = z.infer<typeof BeneficiaryPrimitiveSchema>

export type BeneficiaryPrimitiveUid = z.infer<typeof BeneficiaryPrimitiveUidSchema>

export function parseBeneficiaryPrimitive(beneficiary: BeneficiaryPrimitive): BeneficiaryPrimitive {
  return BeneficiaryPrimitiveSchema.parse(beneficiary)
}

export function parseBeneficiaryPrimitives(beneficiaries: BeneficiaryPrimitive[]): BeneficiaryPrimitive[] {
  return BeneficiariesPrimitiveSchema.parse(beneficiaries)
}

export function parseBeneficiaryPrimitiveUid(beneficiaryUid: BeneficiaryPrimitiveUid): BeneficiaryPrimitiveUid {
  return BeneficiaryPrimitiveUidSchema.parse(beneficiaryUid)
}

export const isEqualBeneficiaryPrimitive = isEqualByDC(parseBeneficiaryPrimitiveUid)
