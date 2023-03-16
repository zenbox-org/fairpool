import { z } from 'zod'
import { NaturalNumberSchema } from '../../../../../generic/models/NaturalNumber'
import { scaleFixed, sharesLengthMax } from '../../Fairpool/constants'
import { NumeratorSchema } from '../Numerator'

const ChildrenLengthSchema = NaturalNumberSchema.max(sharesLengthMax)
const ChildrenNumeratorsSumSchema = NumeratorSchema

export const ShareBoundsSchema = z.object({
  numeratorMin: NumeratorSchema.default(0n),
  numeratorMax: NumeratorSchema.default(scaleFixed),
  childrenLengthMin: ChildrenLengthSchema.default(0),
  childrenLengthMax: ChildrenLengthSchema.default(sharesLengthMax),
  childrenNumeratorsSumMin: ChildrenNumeratorsSumSchema.default(0n),
  childrenNumeratorsSumMax: ChildrenNumeratorsSumSchema.default(scaleFixed),
})

export type ShareBounds = z.infer<typeof ShareBoundsSchema>
