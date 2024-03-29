import { BigIntAdvancedOperations } from '../../../utils/bigint/BigIntAdvancedOperations'
import { BigIntBasicArithmetic } from '../../../utils/bigint/BigIntBasicArithmetic'
import { fromBigIntToNumber } from '../../../utils/bigint/fromBigIntToNumber'
import { rangeBigInt } from '../../../utils/remeda/rangeBigInt'
import { Address as Address } from '../models/Address'
import { Fairpool } from '../models/Fairpool'
import { GetTalliesDeltasFromHoldersConfig } from '../models/GetTalliesDeltaConfig/GetTalliesDeltasFromHoldersConfig'
import { GetTalliesDeltaParams } from '../models/GetTalliesDeltaParams'
import { getTotalSupply } from './getTotalSupply'

const { mod } = BigIntBasicArithmetic
const { clampIn, getShare } = BigIntAdvancedOperations

// const offset = c.getRandomNumber(Number(fairpool.seed))
// const step = c.getRandomNumber(Number(fairpool.seed))

export const getTalliesDeltasFromHolders = (config: GetTalliesDeltasFromHoldersConfig) => (fairpool: Fairpool, sender: Address, params: GetTalliesDeltaParams) => (quoteDistributed: bigint) => {
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
