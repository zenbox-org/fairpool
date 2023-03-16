import { BigIntAdvancedOperations } from '../../../utils/bigint/BigIntAdvancedOperations'
import { getFairpool } from '../contract'
import { State } from '../models/State'

export const clampBaseDeltaRaw = (baseLimit: bigint) => BigIntAdvancedOperations.clamp(0n, baseLimit)

export const clampBaseDeltaRawByState = (state: State) => clampBaseDeltaRaw(getFairpool(state).baseLimit)
