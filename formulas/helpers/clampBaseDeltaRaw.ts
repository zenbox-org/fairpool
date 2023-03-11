import { BigIntBasicOperations } from '../../../utils/bigint/BigIntBasicOperations'
import { getFairpool, State } from '../uni'

export const clampBaseDeltaRaw = (baseLimit: bigint) => BigIntBasicOperations.clamp(0n, baseLimit)

export const clampBaseDeltaRawByState = (state: State) => clampBaseDeltaRaw(getFairpool(state).baseLimit)
