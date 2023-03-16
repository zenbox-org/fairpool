import { z } from 'zod'
import { NaturalNumberSchema } from '../../../../../generic/models/NaturalNumber'
import { AddressSchema } from '../../Address'
import { sharesLengthMax } from '../../Fairpool/constants'
import { GetTalliesDeltaConfigSchema } from '../../GetTalliesDeltaConfig'
import { ShareNameSchema } from '../../ShareName'
import { NumeratorSchema } from '../Numerator'

export const ShareValuesSchema = z.object({
  name: ShareNameSchema,
  numerator: NumeratorSchema,
  getTalliesDeltaConfig: GetTalliesDeltaConfigSchema,
  parent: NaturalNumberSchema.max(sharesLengthMax - 1),
  owner: AddressSchema,
  // children: NaturalNumberSchema.max(sharesLengthMax - 1).array().max(sharesLengthMax),
})

export type ShareValues = z.infer<typeof ShareValuesSchema>
