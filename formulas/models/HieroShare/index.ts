import { assertByUnary } from '../../../../utils/assert'
import { BigIntBasicValidations } from '../../../../utils/bigint/BigIntBasicArithmetic'
import { Quotient } from '../../../../utils/Quotient'
import { todo } from '../../../../utils/todo'
import { GetTalliesDeltaConfig } from '../GetTalliesDeltaConfig'

export interface HieroShare {
  getTalliesDeltaConfig: GetTalliesDeltaConfig
  quotient: Quotient<bigint>
  children: HieroShare[]
}

const { isValidQuotientSum } = BigIntBasicValidations

export const validateHieroShare = todo((share: HieroShare): HieroShare => share)

export const validateHieroShares = (shares: HieroShare[]): HieroShare[] => {
  const quotients = shares.map(s => s.quotient)
  assertByUnary(isValidQuotientSum, 'isValidQuotientSum')(quotients, 'quotients')
  return shares.map(s => ({
    ...s,
    children: validateHieroShares(s.children),
  }))
}
