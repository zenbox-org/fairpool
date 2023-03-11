import { record } from 'fast-check'
import { BigIntBasicArithmetic } from '../../../utils/bigint/BigIntBasicArithmetic'
import { BigIntBasicOperations } from '../../../utils/bigint/BigIntBasicOperations'
import { input } from '../../../utils/debug'
import { assertPRD } from '../../../utils/fast-check/assert'
import { testFun } from '../../../utils/jest/testFun'
import { todo } from '../../../utils/todo'
import { fairpoolArb } from '../arbitraries/getFairpoolZeroSharesArb'

const { mod } = BigIntBasicArithmetic
const { clampIn, getShare } = BigIntBasicOperations

testFun.skip(async function assertTalliesDeltaLengthIsEqualToHoldersPerDistributionMax() {
  const argsArb = record({ fairpool: fairpoolArb })
  return assertPRD(argsArb, async function assertTalliesDeltaLengthIsEqualToHoldersPerDistributionMaxRunner(args) {
    input(__filename, assertTalliesDeltaLengthIsEqualToHoldersPerDistributionMaxRunner, args)
    const { fairpool } = args
    return todo()
  })
})

testFun.skip(async function assertTalliesDeltaLongTermSumConvergesToUniformDistribution() {

})
