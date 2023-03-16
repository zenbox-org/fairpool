import { getGenMutilatorsWithAmount } from '../../../../finance/models/FintGen/getGenMutilatorsWithAmount'
import { BigIntBasicArithmetic } from '../../../../utils/bigint/BigIntBasicArithmetic'

export const BigIntGenMutilatorsWithAmount = getGenMutilatorsWithAmount(BigIntBasicArithmetic)

export const { addB, subB, mulB, divB, sendB } = BigIntGenMutilatorsWithAmount
