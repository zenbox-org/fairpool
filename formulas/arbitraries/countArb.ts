import { integer } from 'fast-check'

export const countArb = integer({
  min: 1,
  max: 100,
})
