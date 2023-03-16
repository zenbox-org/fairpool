import { record } from 'fast-check'
import { clampBaseDeltaRawByState } from '../helpers/clampBaseDeltaRaw'
import { baseDeltaRawArb } from './baseDeltaRawArb'
import { stateArb } from './stateArb'

export const stateWithBaseDeltaArb = record({
  state: stateArb,
  baseDeltaRaw: baseDeltaRawArb,
}).map(({
  state,
  baseDeltaRaw,
}) => ({
  state,
  baseDelta: clampBaseDeltaRawByState(state)(baseDeltaRaw),
}))
