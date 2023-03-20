import { z } from 'zod'
import { Uint256BigIntSchema } from '../../../../../ethereum/models/Uint256BigInt'
import { scaleFixed, sharesLengthMaxN } from '../../Fairpool/constants'
import { NumeratorSchema } from '../Numerator'

const ChildrenLengthSchema = Uint256BigIntSchema.max(sharesLengthMaxN)
const ChildrenNumeratorsSumSchema = NumeratorSchema

export const ShareBoundsSchema = z.object({
  numeratorMin: NumeratorSchema.default(0n),
  numeratorMax: NumeratorSchema.default(scaleFixed),
  childrenLengthMin: ChildrenLengthSchema.default(0n),
  childrenLengthMax: ChildrenLengthSchema.default(sharesLengthMaxN),
  childrenNumeratorsSumMin: ChildrenNumeratorsSumSchema.default(0n),
  childrenNumeratorsSumMax: ChildrenNumeratorsSumSchema.default(scaleFixed),
})

export type ShareBounds = z.infer<typeof ShareBoundsSchema>
