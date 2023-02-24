import { strict as assert } from 'assert'
import { array, integer } from 'fast-check'

export const getNumeratorsArb = (length: number, min = 1, max = 5000) => {
  assert(min <= max)
  assert(max >= 1)
  return array(
    integer({
      min: 1, // must be at least 1, so that the generated value is not zero
      max: max, // may be any number higher than 1, higher numbers will lead to more diversity between the generated values
    }),
    {
      minLength: length,
      maxLength: length,
    },
  )
}
