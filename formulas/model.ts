import { createPipe, pick, pipe } from 'remeda'
import { asSafeMutator } from '../../divide-and-conquer/asSafeMutator'
import { renderThoughtLikesMD } from '../../generic/models/Thought'
import { assertNeq, assertTrue } from '../../utils/assert'
import { sumAmounts } from '../../utils/bigint/BigIntAdvancedOperations'
import { assert } from '../../utils/bigint/BigIntAllAssertions'
import { add, div, fromNumber, gt, max, mul, one, sqrt, sub, zero } from '../../utils/bigint/BigIntBasicArithmetic'
import { inner, input, output } from '../../utils/debug'
import { ensureByIndex, ensureFind } from '../../utils/ensure'
import { getHardcodedFilename } from '../../utils/getHardcodedFilename'
import { Quotient } from '../../utils/Quotient'
import { meldWithLast } from '../../utils/remeda/meldWithLast'
import { todo } from '../../utils/todo'
import { getAmount } from './helpers/getAmount'
import { getPriceParamsFun } from './helpers/getPriceParamsFun'
import { getBaseSupply, getQuoteSupply } from './helpers/getSupply'
import { getTalliesDeltasFromHieroShares } from './helpers/getTalliesDeltasFromHieroShares'
import { getTotalSupply } from './helpers/getTotalSupply'
import { Buy } from './models/Action/BaseAction/Buy'
import { Address } from './models/Address'
import { Amount } from './models/Amount'
import { BaseDeltaMustBeGreaterThanZero } from './models/AssertionFailedError/BaseDeltaMustBeGreaterThanZero'
import { QuoteDeltaMustBeGreaterThanZero } from './models/AssertionFailedError/QuoteDeltaMustBeGreaterThanZero'
import { Balance } from './models/Balance'
import { getBalanceD, grabBalance } from './models/Balance/helpers'
import { N } from './models/bigint'
import { addB, sendB, subB } from './models/bigint/BigIntGenMutilatorsWithAmount'
import { getBoundedArrayFromQuotients, getQuotientsFromNumerators } from './models/bigint/BigIntQuotientFunctions'
import { Blockchain } from './models/Blockchain'
import { Fairpool } from './models/Fairpool'
import { getHieroShares } from './models/Fairpool/getHieroShares'
import { GetTalliesDeltasFromRecipientConfig } from './models/GetTalliesDeltaConfig/GetTalliesDeltasFromRecipientConfig'
import { GetTalliesDeltaParams } from './models/GetTalliesDeltaParams'
import { HieroShare, parseHieroShare } from './models/HieroShare'
import { Share } from './models/Share'
import { Numerator } from './models/Share/Numerator'
import { ShareExposedField } from './models/Share/ShareExposedField'
import { parseState, State } from './models/State'

const filename = getHardcodedFilename('uni.ts')

/**
 * For illustration purposes only
 * This is a special formula that works only for "derived quoteSupply"
 * "derived quoteSupply" is quoteSupply that was returned from a call to getQuoteSupply
 */
export const getBaseSupplyForDerivedQuoteSupply = (baseLimit: N, quoteOffset: N) => (quoteSupply: N) => {
  if (quoteSupply == 0n) return 0n
  const quoteSupplyNext = quoteSupply + 1n // derived quoteSupply is at least 1n less than quoteSupply that will result in a symmetric baseSupply
  const numerator = mul(baseLimit, quoteSupplyNext)
  const denominator = add(quoteOffset, quoteSupplyNext)
  const baseSupply = div(numerator, denominator)
  assert.lt(baseSupply, baseLimit, 'baseSupply', 'baseLimit')
  return baseSupply
}

export const getBaseDelta = (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (quoteDeltaProposed: N) => {
  const quoteSupplyNew = add(quoteSupplyCurrent, quoteDeltaProposed)
  const baseSupplyNew = getBaseSupply(baseLimit, quoteOffset)(quoteSupplyNew)
  return sub(baseSupplyNew, baseSupplyCurrent)
}

export const getQuoteDelta = (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (baseDeltaProposed: N) => {
  const baseSupplyNew = sub(baseSupplyCurrent, baseDeltaProposed)
  const quoteSupplyNew = getQuoteSupply(baseLimit, quoteOffset)(baseSupplyNew)
  return sub(quoteSupplyCurrent, quoteSupplyNew)
}

/**
 * quoteSupplyMax == quoteOffset * (baseLimit - 1)
 */
export const getQuoteSupplyMax = (baseLimit: N, quoteOffset: N) => {
  return mul(quoteOffset, sub(baseLimit, one))
}

export const getQuoteSupplyMaxF = getPriceParamsFun(getQuoteSupplyMax)

export const getQuoteSupplyMaxByDefinition = (baseLimit: N, quoteOffset: N) => {
  return getQuoteSupply(baseLimit, quoteOffset)(sub(one)(baseLimit))
}

export const getQuoteSupplyMaxByDefinitionF = getPriceParamsFun(getQuoteSupplyMaxByDefinition)

export const getQuoteSupplyFor = (baseLimit: N, quoteOffset: N) => (baseSupply: N) => {
  const toQuoteSupply = getQuoteSupply(baseLimit, quoteOffset)
  const toBaseLimit = getBaseSupply(baseLimit, quoteOffset)
  const quoteSupply = toQuoteSupply(baseSupply)
  if (toBaseLimit(quoteSupply) === baseSupply) {
    return quoteSupply
  } else {
    return quoteSupply + 1n
  }
}

export const getQuoteSupplyForF = getPriceParamsFun(getQuoteSupplyFor)

export const getQuoteDeltaMin = (baseLimit: N, quoteOffset: N) => getQuoteSupplyFor(baseLimit, quoteOffset)(one)

export const getQuoteDeltaMinF = getPriceParamsFun(getQuoteDeltaMin)

// /**
//  * TODO: Rewrite to (quoteDeltaDefault: N) => (quoteDeltaMultipliers: N[])
//  */
// export const getQuoteDeltaNext = (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (quoteDeltaPrev: N) => {
//   const { add, sub, mul, div, one } = arithmetic
//   const deltas = getBuyDeltas(baseLimit, quoteOffset)(baseSupplyCurrent, quoteSupplyCurrent)(quoteDeltaPrev)
//   const baseSupplyNew = add(deltas.baseDelta)(baseSupplyCurrent)
//   const quoteSupplyNew = add(deltas.quoteDelta)(quoteSupplyCurrent)
//   return getQuoteDeltaMin(baseLimit, quoteOffset)(baseSupplyNew, quoteSupplyNew)
// }

type GetRandomNumber = (seed: number) => number

const getRandomNumberTodo: GetRandomNumber = () => todo()

// export const getTalliesDeltas = (getRandomNumber: GetRandomNumber) => (shares: Share[]) => (amount: bigint) => {
//   // TODO: find a way to generate a random sublist of holders that is equal to blockchain way
//   return validateTalliesDeltas(todo())
// }

/**
 * NOTE: actual deltas are always less than or equal to expected deltas (because of integer division)
 */
export const getBuyDeltas = (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (quoteDeltaProposed: N) => {
  input(filename, getBuyDeltas, { baseSupplyCurrent, quoteSupplyCurrent, quoteDeltaProposed })
  assert.gte(quoteDeltaProposed, zero, 'quoteDeltaProposed', 'zero')
  const quoteSupplyProposed = add(quoteSupplyCurrent, quoteDeltaProposed)
  const baseSupplyNew = getBaseSupply(baseLimit, quoteOffset)(quoteSupplyProposed)
  const quoteSupplyNew = getQuoteSupply(baseLimit, quoteOffset)(baseSupplyNew)
  assert.lte(quoteSupplyNew, quoteSupplyProposed, 'quoteSupplyNew', 'quoteSupplyProposed')
  const baseDelta = sub(baseSupplyNew, baseSupplyCurrent)
  const quoteDelta = sub(quoteSupplyNew, quoteSupplyCurrent)
  // inter(__filename, getBuyDeltas, { baseDelta, quoteDelta })
  if (!gt(zero)(baseDelta)) throw new BaseDeltaMustBeGreaterThanZero({ baseDelta })
  if (!gt(zero)(quoteDelta)) throw new QuoteDeltaMustBeGreaterThanZero({ quoteDelta })
  return output(filename, getBuyDeltas, { baseDelta, quoteDelta })
}

/**
 * NOTE: actual deltas are always less than or equal to expected deltas (because of integer division)
 * NOTE: sell deltas are positive, but they should be subtracted from the current balances (not added)
 */
export const getSellDeltas = (baseLimit: N, quoteOffset: N) => (baseSupplyCurrent: N, quoteSupplyCurrent: N) => (baseDeltaProposed: N) => {
  input(filename, getSellDeltas, { baseSupplyCurrent, quoteSupplyCurrent, baseDeltaProposed })
  const baseSupplyProposed = sub(baseSupplyCurrent, baseDeltaProposed)
  const quoteSupplyProposed = getQuoteSupply(baseLimit, quoteOffset)(baseSupplyProposed)
  const baseDelta = sub(baseSupplyCurrent, baseSupplyProposed)
  const quoteDelta = sub(quoteSupplyCurrent, quoteSupplyProposed)
  inner(filename, getSellDeltas, { baseDelta, quoteDelta })
  if (!gt(zero)(baseDelta)) throw new BaseDeltaMustBeGreaterThanZero({ baseDelta })
  if (!gt(zero)(quoteDelta)) throw new QuoteDeltaMustBeGreaterThanZero({ quoteDelta })
  return output(filename, getSellDeltas, { baseDelta, quoteDelta })
}

// export const getTotalSupplyR = (asset: Asset) => (recks: Fint[]) => getTotalSupply(recks.filter(b => b.asset === asset))

/**
 * @deprecated
 */
export const getQuoteSupplyAcceptableMax = (baseLimit: N, quoteOffset: N) => {
  const two = add(one, one)
  const four = add(two, two)
  // 1/2 * (sqrt(4 * l * o + 1) - 2 * o - 1)
  return div(two)(sub(
    sqrt(add(mul(four)(mul(baseLimit)(quoteOffset)), one)),
    sub(mul(two)(quoteOffset), one)
  ))
}

/**
 * initialPrice = quoteOffset / baseLimit
 * baseSupplySuperlinearMin = baseLimit / (initialPrice + 1)
 * NOTE: baseSupplySuperlinearMin can be zero
 *
 * if (baseSupply < baseSupplySuperlinearMin) quoteSupply == initialPrice * baseSupply
 * if (baseSupply == baseSupplySuperlinearMin) quoteSupply >= initialPrice * baseSupply
 * if (baseSupply > baseSupplySuperlinearMin) quoteSupply > initialPrice * baseSupply
 */
export const getBaseSupplySuperlinearMin = (baseLimit: N, quoteOffset: N) => {
  const initialPrice = getInitialPrice(baseLimit, quoteOffset)
  const denominator = add(initialPrice, one)
  return div(baseLimit, denominator)
}

export const getBaseSupplySuperlinearMinF = getPriceParamsFun(getBaseSupplySuperlinearMin)

export const getInitialPrice = (baseLimit: N, quoteOffset: N) => div(quoteOffset, baseLimit)

export const getBaseDeltasFromNumerators = (baseLimit: N, quoteOffset: N) => (baseDeltaMin: N, baseSupplyMax: N) => (numerators: number[]) => {
  const toBoundedArrayLocal = getBoundedArrayFromQuotients(baseDeltaMin, baseSupplyMax)
  return pipe(numerators.map(fromNumber), getQuotientsFromNumerators, toBoundedArrayLocal)
}

export const getBaseDeltasFromBaseDeltaNumeratorsSuperlinearSafe = (baseLimit: N, quoteOffset: N) => {
  const baseSupplySuperlinearMin = getBaseSupplySuperlinearMin(baseLimit, quoteOffset)
  const baseDeltaMin = max(one, baseSupplySuperlinearMin) // yes, max(), because baseDeltaMin must be gte one and gte baseSupplySuperlinearMin, but baseSupplySuperlinearMin may be eq zero
  const baseSupplyMax = sub(one)(baseLimit)
  return getBaseDeltasFromNumerators(baseLimit, quoteOffset)(baseDeltaMin, baseSupplyMax)
}

export const getBaseDeltasFromBaseDeltaNumeratorsFullRange = (baseLimit: N, quoteOffset: N) => {
  const baseSupplyMax = pipe(baseLimit, sub(one), sub(one)) // subtract twice because getQuoteSupplyFor does add(one)(baseSupply)
  return getBaseDeltasFromNumerators(baseLimit, quoteOffset)(one, baseSupplyMax)
}

export const getBaseSuppliesFromBaseDeltas = meldWithLast(add, zero)

export const getQuoteDeltasFromBaseDeltas = (baseLimit: N, quoteOffset: N) => (baseDeltas: N[]) => {
  const baseSupplies = getBaseSuppliesFromBaseDeltas(baseDeltas)
  return baseSupplies.map(getQuoteSupplyFor(baseLimit, quoteOffset))
}

export const getQuoteDeltasFromBaseDeltasF = getPriceParamsFun(getQuoteDeltasFromBaseDeltas)

export const getQuoteDeltasFromBaseDeltaNumeratorsSuperlinearSafe = (baseLimit: N, quoteOffset: N) => createPipe(
  getBaseDeltasFromBaseDeltaNumeratorsSuperlinearSafe(baseLimit, quoteOffset),
  getQuoteDeltasFromBaseDeltas(baseLimit, quoteOffset)
)

export const getQuoteDeltasFromBaseDeltaNumeratorsFullRange = (baseLimit: N, quoteOffset: N) => createPipe(
  getBaseDeltasFromBaseDeltaNumeratorsFullRange(baseLimit, quoteOffset),
  getQuoteDeltasFromBaseDeltas(baseLimit, quoteOffset)
)

export const getQuoteDeltasFromBaseDeltaNumeratorsFullRangeF = getPriceParamsFun(getQuoteDeltasFromBaseDeltaNumeratorsFullRange)

export const getStateLocal = (contract: Address) => ({ blockchain, fairpools }: State) => ({
  fairpool: ensureFind(fairpools, f => f.address === contract),
  blockchain,
})

// export const getBalancesLocal = (contract: Address, sender: Address) => (fairpool: Fairpool, blockchain: Blockchain) => {
//   return {
//     [contract]: {
//       base: getBalance(contract)(fairpool.balances),
//       quote: getBalance(contract)(blockchain.balances),
//     },
//     [sender]: {
//       base: getBalance(sender)(fairpool.balances),
//       quote: getBalance(sender)(blockchain.balances),
//     },
//   }
// }

export const getBalancesLocalD = (addresses: Address[]) => (fairpool: Fairpool, blockchain: Blockchain) => {
  return Object.fromEntries<{ base: Balance, quote: Balance }>(addresses.map(address => [address, {
    base: getBalanceD(address)(fairpool.balances),
    quote: getBalanceD(address)(blockchain.balances),
  }]))
}

export const buy = (contract: Address, sender: Address, quoteDeltaProposed: Amount) => asSafeMutator((state: State) => {
  input(filename, buy, { action: 'buy', contract, sender, quoteDeltaProposed })
  const { fairpool, blockchain } = getStateLocal(contract)(state)
  const { baseLimit, quoteOffset } = fairpool
  // const balancesContract = getBalancesLocal(contract)(balances)
  // const balancesSender = getBalancesLocal(sender)(balances)
  const baseSupplyCurrent = getTotalSupply(fairpool.balances)
  const quoteSupplyCurrent = fairpool.quoteSupply
  const { baseDelta, quoteDelta } = getBuyDeltas(baseLimit, quoteOffset)(baseSupplyCurrent, quoteSupplyCurrent)(quoteDeltaProposed)
  const balanceSenderBase = grabBalance(sender)(fairpool.balances)
  const balanceSenderQuote = grabBalance(sender)(blockchain.balances)
  const balanceContractQuote = grabBalance(contract)(blockchain.balances)
  addB(baseDelta)(balanceSenderBase)
  sendB(quoteDelta)(balanceSenderQuote, balanceContractQuote)
  fairpool.quoteSupply += quoteDelta
  return parseState(state)
})

export const buyA = ({ contract, sender, quoteDeltaProposed }: Buy) => buy(contract, sender, quoteDeltaProposed)

const total: Quotient<bigint> = { numerator: 1n, denominator: 1n }

/**
 * Wrap the fairpool.shares in a sender share (100%) to reuse the distribution code
 */
const getSenderHieroShare = (shares: HieroShare[]) => (sender: Address) => parseHieroShare({
  name: 'sender',
  getTalliesDeltaConfig: {
    type: 'GetTalliesDeltasFromRecipientConfig',
    address: sender,
  },
  quotient: total,
  children: shares,
})

// const getHieroSharesFromSimpleShares = (shares: SimpleShare[]): HieroShare[] => {
//   const [head, tail] = shares
//   const [root] = head
//   const holdersShare: HieroShare = {
//     quotient: getScaledQuotient(root),
//   }
//   return shares.map(([root, rootReferral, rootReferralDiscount]) => ({
//     quotient: getScaledQuotient(root),
//     getTalliesDeltaConfig: {
//       type: '',
//     },
//   }))
// }

export const sell = (contract: Address, sender: Address, baseDeltaProposed: N) => asSafeMutator((state: State) => {
  input(filename, sell, { action: 'sell', contract, sender, baseDeltaProposed })
  const { fairpool, blockchain } = getStateLocal(contract)(state)
  const { baseLimit, quoteOffset } = fairpool
  const baseSupplyCurrent = getTotalSupply(fairpool.balances)
  const quoteSupplyCurrent = fairpool.quoteSupply
  const { baseDelta, quoteDelta } = getSellDeltas(baseLimit, quoteOffset)(baseSupplyCurrent, quoteSupplyCurrent)(baseDeltaProposed)
  const params: GetTalliesDeltaParams = todo({ step: 0n, offset: 0n })
  const shares = getHieroShares(fairpool)
  const talliesDeltas = getTalliesDeltasFromHieroShares(fairpool, sender, params)(shares)(quoteDelta)
  const quoteDistributed = sumAmounts(talliesDeltas)
  assert.eq(quoteDistributed, quoteDelta, 'quoteDistributed', 'quoteDelta')
  for (const tallyDelta of talliesDeltas) {
    const tally = grabBalance(tallyDelta.address)(fairpool.tallies)
    tally.amount += tallyDelta.amount
  }
  const tallySenderQuote = grabBalance(sender)(fairpool.tallies)
  const balanceSenderBase = grabBalance(sender)(fairpool.balances)
  const balanceSenderQuote = grabBalance(sender)(blockchain.balances)
  const balanceContractQuote = grabBalance(contract)(blockchain.balances)
  sendB(tallySenderQuote.amount)(balanceContractQuote, balanceSenderQuote)
  subB(baseDelta)(balanceSenderBase)
  tallySenderQuote.amount = 0n
  fairpool.quoteSupply -= quoteDelta
  return parseState(state)
})

export const selloff = (contract: Address, sender: Address) => asSafeMutator((state: State) => {
  const { fairpool, blockchain } = getStateLocal(contract)(state)
  const baseDelta = getAmount(sender)(fairpool.balances)
  return sell(contract, sender, baseDelta)(state)
})

export const setShareNumerator = (contract: Address, sender: Address, index: number, numerator: Numerator) => asSafeMutator((state: State) => {
  const { fairpool, blockchain } = getStateLocal(contract)(state)
  const share = fairpool.shares[index]
  const field: ShareExposedField = 'numerator'
  assertNeq(share, undefined, 'share', 'undefined')
  assertTrue(canUpdateShareField(fairpool)(share, field)(sender), 'canUpdateShare(fairpool)(share)(sender)')
  const { numeratorMin, numeratorMax } = share
  assert.gtelte(numeratorMin, numeratorMax)(numerator, 'numerator')
  share[field] = numerator
  return parseState(state)
})

export const addShare = (contract: Address, sender: Address, share: Share) => asSafeMutator((state: State) => {
  const { fairpool, blockchain } = getStateLocal(contract)(state)
  // const share = fairpool.shares[index]
  // assertNeq(share, undefined, 'share', 'undefined')
  // assertTrue(canUpdateShare(fairpool)(share)(sender), 'canUpdateShare(fairpool)(share)(sender)')
  // const { numeratorMin, numeratorMax } = share
  // assert.gtelte(numeratorMin, numeratorMax)(numerator, 'numerator')
  // share.numerator = numerator
  return parseState(state)
})

const canUpdateShareField = (fairpool: Fairpool) => (share: Share, field: ShareExposedField) => (sender: Address) => {
  return todo<boolean>(undefined, renderThoughtLikesMD([
    /**
     * Use ECDSA signatures?
     * - Ensure signatures can't be reused
     *   - Options
     *     - Update the seed after each use
     *     - Hash with a deadline
     *
     * Allow multiple sets of owners? (Address[][])
     * - But who is allowed to add a new set of owners?
     *   - An existing set of owners
     */
  ]))
}

export const getFairpoolAt = (index: number) => (state: State) => ensureByIndex(state.fairpools, index)

export const getFairpoolByAddress = (address: Address) => (state: State) => ensureFind(state.fairpools, f => f.address === address)

export const getFairpool = getFairpoolAt(0)

export const getFairpoolQuoteOffset = (state: State) => getFairpool(state).quoteOffset

export const getPricingParamsFromFairpool = pick<keyof Fairpool>(['baseLimit', 'quoteOffset'])
