import { writeFile } from 'fs/promises'
import { ZeroAddress } from '../../ethereum/data/allAddresses'
import { isLogEnabled } from '../../utils/debug'
import { getExperimentOutputMin } from './experiments'
import { parseBalance, parseBalances } from './models/Balance'
import { baseLimitMin } from './models/BaseLimit/constants'
import { parseBlockchain } from './models/Blockchain'
import { parseFairpool } from './models/Fairpool'
import { holdersPerDistributionMaxFixed, scaleFixed } from './models/Fairpool/constants'
import { parseHieroShares } from './models/HieroShare'
import { parsePriceParams } from './models/PriceParams'
import { quoteOffsetMin } from './models/QuoteOffset/constants'
import { parseShares } from './models/Share'

if (isLogEnabled) await writeFile('/tmp/stats', getExperimentOutputMin())

export const balanceZero = parseBalance({
  address: ZeroAddress,
  amount: 0n,
})

export const priceParamsZero = parsePriceParams({
  baseLimit: baseLimitMin,
  quoteOffset: quoteOffsetMin,
})

export const balancesZero = parseBalances([])

export const talliesZero = parseBalances([])

export const hieroSharesZero = parseHieroShares([])

export const sharesZero = parseShares([])

export const fairpoolZero = parseFairpool({
  address: ZeroAddress,
  ...priceParamsZero,
  balances: balancesZero,
  tallies: talliesZero,
  quoteSupply: 0n,
  shares: sharesZero,
  scale: scaleFixed,
  seed: 0n,
  owner: ZeroAddress,
  operator: ZeroAddress,
  holdersPerDistributionMax: holdersPerDistributionMaxFixed,
})

export const blockchainZero = parseBlockchain({
  balances: balancesZero,
})

// const getTalliesDeltasWithReferrals: GetTalliesDeltasHierarchical = todo()

// const getSharesDefault = (marketerShare: Partial<ShareHierarchical>, developerShare: Partial<ShareHierarchical> & Pick<ShareHierarchical, 'recipient'>): ShareHierarchical[] => [
//   {
//     quotient: getPercentScaledQuotient(10n),
//     recipient: ZeroAddress,
//     referralsMap: {},
//     isRecognizedReferralMap: {},
//     getTalliesDeltas: getTalliesDeltasHolders,
//   },
//   {
//     quotient: getPercentScaledQuotient(7n),
//     referralsMap: {},
//     isRecognizedReferralMap: {},
//     getTalliesDeltas: getTalliesDeltasWithReferrals,
//   },
//   {
//     quotient: getPercentScaledQuotient(25n, 1000n),
//     referralsMap: {},
//     isRecognizedReferralMap: {},
//     getTalliesDeltas: todo(),
//     ...developerShare,
//   },
// ]
