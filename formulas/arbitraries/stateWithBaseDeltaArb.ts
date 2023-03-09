import { record } from 'fast-check'
import { clampBaseDeltaRawByState } from '../helpers/clampBaseDeltaRaw'
import { stateArb } from '../uni.test'
import { baseDeltaRawArb } from './baseDeltaRawArb'

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
