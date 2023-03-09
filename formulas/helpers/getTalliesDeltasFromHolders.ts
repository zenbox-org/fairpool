import { BigIntBasicArithmetic, BigIntBasicOperations } from '../../../utils/bigint/arithmetic'
import { fromBigIntToNumber } from '../../../utils/bigint/fromBigIntToNumber'
import { rangeBigInt } from '../../../utils/remeda/rangeBigInt'
import { getTotalSupply } from '../helpers'
import { GetTalliesDeltaFromHoldersConfig } from '../models/GetTalliesDeltaConfig'
import { Fairpool, GetTalliesDeltaParams } from '../uni'

const { mod } = BigIntBasicArithmetic
const { clampIn, getShare } = BigIntBasicOperations

// const offset = c.getRandomNumber(Number(fairpool.seed))
// const step = c.getRandomNumber(Number(fairpool.seed))

export const getTalliesDeltasFromHolders = (config: GetTalliesDeltaFromHoldersConfig) => (fairpool: Fairpool, params: GetTalliesDeltaParams) => (quoteDistributed: bigint) => {
  const { balances, holdersPerDistributionMax } = fairpool
  const { offset, step } = params
  const length = BigInt(balances.length)
  const indexesLocal = rangeBigInt(0n, holdersPerDistributionMax).map(multiplier => {
    const indexBigInt = mod(offset + step * multiplier, length)
    return fromBigIntToNumber(indexBigInt)
  })
  const balancesLocal = indexesLocal.map(i => balances[i])
  const totalSupplyLocal = getTotalSupply(balancesLocal)
  return balancesLocal.map(({ address, amount }) => ({
    address,
    amount: getShare(totalSupplyLocal)(amount)(quoteDistributed),
  }))
}
