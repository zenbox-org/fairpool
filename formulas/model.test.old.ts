import { expect, test } from '@jest/globals'
import { bigInt, record } from 'fast-check'
import { Arbitrary } from 'fast-check/lib/types/check/arbitrary/definition/Arbitrary'
import { createPipe, isError, last, map, sort, times, zip } from 'remeda'
import { validateTransition } from '../../divide-and-conquer/models/ParserTransition/parseTransitionViaFilters'
import { assertEq, assertTwo } from '../../utils/assert'
import { BigIntAdvancedOperations } from '../../utils/bigint/BigIntAdvancedOperations'
import { BigIntAllAssertions } from '../../utils/bigint/BigIntAllAssertions'
import { BigIntArrayComparisons } from '../../utils/bigint/BigIntArrayComparisons'
import { BigIntBasicArithmetic } from '../../utils/bigint/BigIntBasicArithmetic'
import { BoundsBI } from '../../utils/Bounds'
import { inside } from '../../utils/Bounds/inside'
import { dbg, dbgS, debug, inner, input, output } from '../../utils/debug'
import { ensure } from '../../utils/ensure'
import { safely } from '../../utils/Error/safely'
import { assertPRD } from '../../utils/fast-check/assert'
import { getHardcodedFilename } from '../../utils/getHardcodedFilename'
import { testFun } from '../../utils/jest/testFun'
import { Modifier, ModifierV } from '../../utils/Modifier'
import { NonEmptyArray } from '../../utils/NonEmptyArray'
import { compareNumerals } from '../../utils/numeral/sort'
import { sequentialReducePushV } from '../../utils/promise'
import { after } from '../../utils/remeda/wrap'
import { todo } from '../../utils/todo'
import { Referral } from '../models/Referral'
import { PairOfReferralsSortedAscendingByLength } from '../models/Referral/PairOfReferralsSortedAscendingByLength'
import { countArb } from './arbitraries/countArb'
import { getNumeratorsArb } from './arbitraries/getNumeratorsArb'
import { priceParamsArb } from './arbitraries/priceParamsArb'
import { stateArb } from './arbitraries/stateArb'
import { uint256Arb } from './arbitraries/uint256Arb'
import { assertBalanceDiffs } from './assertBalanceDiffs'
import { cleanState } from './clean'
import { quoteOffsetMultiplierMaxGetter, quoteOffsetMultiplierMin } from './constants'
import { alice, base, bob, contract, quote, quoteDeltaDefault, stateDefault } from './default'
import { getAmountsBQ, getBalancesBQ } from './helpers'
import { getAmountD } from './helpers/getAmount'
import { getBaseSupply, getQuoteSupply } from './helpers/getSupply'
import { buy, buyA, getBalancesLocalD, getBaseDeltasFromNumerators, getBaseSupplySuperlinearMin, getBaseSupplySuperlinearMinF, getFairpool, getPricingParamsFromFairpool, getQuoteDeltasFromBaseDeltaNumeratorsFullRangeF, getQuoteDeltasFromBaseDeltas, getQuoteDeltasFromBaseDeltasF, getQuoteSupplyFor, getQuoteSupplyMax, getQuoteSupplyMaxByDefinition, selloff } from './model'
import { Action } from './models/Action'
import { Buy } from './models/Action/BaseAction/Buy'
import { Address } from './models/Address'
import { Balance } from './models/Balance'
import { getBalancesBase, getBalancesQuote } from './models/Balance/getBalances'
import { getBalanceD } from './models/Balance/helpers'
import { BalanceDeltaTuple } from './models/BalanceDeltaTuple'
import { BigIntQuotientFunctions } from './models/bigint/BigIntQuotientFunctions'
import { Fairpool } from './models/Fairpool'
import { PrePriceParams } from './models/PrePriceParams'
import { Shift } from './models/Shift'
import { parseState, State } from './models/State'
import { parseTransition } from './models/Transition'

const { zero, one, fromNumber, add, sub, mul, div, mod, min, max, abs, sqrt, eq, lt, gt, lte, gte } = BigIntBasicArithmetic
const { sum, sumAmounts, halve, clamp, clampIn, getShare, getDeltas } = BigIntAdvancedOperations
const { getQuotientsFromNumberNumerators, getBoundedArrayFromQuotients, getValuesFromNumerators } = BigIntQuotientFunctions
const { isAscending, isDescending, isAscendingStrict, isDescendingStrict } = BigIntArrayComparisons
const assert = BigIntAllAssertions

type ActionFunc = Modifier<State>

/** helpers */
const getPricingParams = ({ quoteOffsetMultiplierProposed, baseLimit }: PrePriceParams) => {
  const quoteOffsetMultiplierMax = quoteOffsetMultiplierMaxGetter(baseLimit)
  const quoteOffsetMultiplier = clampIn(quoteOffsetMultiplierMin, quoteOffsetMultiplierMax)(quoteOffsetMultiplierProposed)
  return ({
    baseLimit,
    quoteOffset: mul(baseLimit, quoteOffsetMultiplier),
  })
}
const getBalances = getBalancesBQ(base, quote)
const getAmounts = getAmountsBQ(base, quote)

const getBalancesStats = (state: State) => getBalancesLocalD([alice, bob])(getFairpool(state), state.blockchain)
const dbgBalancesStatsAction = (state: State) => {
  const stats = getBalancesStats(state)
  dbgS(filename, 'dbgBalancesStats', 'inter', stats)
  return state
}
const dbgContextAction = (state: State) => {
  dbg(filename, dbgContextAction, 'input', getPricingParamsFromFairpool(state.fairpools[0]))
  return state
}
const getBalancesHistoryBaseAlice = createPipe(map(getBalancesBase), map(getBalanceD(alice)))
const getAmountsHistoryBaseAlice = createPipe(getBalancesHistoryBaseAlice, map((b: Balance) => b.amount))
const sumAmountsHistoryBaseAlice = createPipe(getAmountsHistoryBaseAlice, sum)
const filename = getHardcodedFilename('uni.test.ts')
const run = <Val, Args extends unknown[]>(mutators: ModifierV<Val, Args>[], ...args: Args) => (value: Val) => {
  const mutatorsWithSeparator = mutators.map<ModifierV<Val, Args>>(mutator => (obj, ...args) => {
    debug(filename, run, '>>>')
    // debug(__filename, run, getBalancesStats(obj))
    return mutator(obj, ...args)
  })
  const results = sequentialReducePushV(mutatorsWithSeparator, ...args)(value)
  debug(filename, run, '<<<')
  return results
}

const getProfitFromActions = (seller: Address) => (actions: ActionFunc[]) => (stateInitial: State) => {
  const history = run(actions)(stateInitial)
  const stateFinal = last(history)
  const getAmountLocalD = getAmountD(seller)
  const amountInitial = getAmountLocalD(stateInitial.blockchain.balances)
  const amountFinal = getAmountLocalD(stateFinal.blockchain.balances)
  return sub(amountFinal, amountInitial)
}
const getProfitFromTuples = (tuples: NonEmptyArray<BalanceDeltaTuple>) => {
  const seller = tuples[0][0]
  const actions = getActionsLeadingToProfit(tuples)
  return getProfitFromActions(seller)(actions)
}
const getActionsLeadingToProfit = (tuples: NonEmptyArray<BalanceDeltaTuple>): NonEmptyArray<ActionFunc> => {
  const seller = tuples[0][0]
  const buys = tuples.map(([wallet, delta]) => buy(contract, wallet, delta))
  const actions = [
    ...buys,
    selloff(contract, seller),
  ].map(after(dbgBalancesStatsAction))
  return [dbgContextAction, ...actions]
}
const getEqualTuplesFromWallets = (fairpool: Fairpool) => (wallets: Address[]) => {
  // NOTE: The baseDeltas for each wallet will be equal to (baseLimit - 1) / wallets.length
  const baseDeltaNumerators = wallets.map(_ => 1)
  return getTuplesFromWalletsAndNumerators(fairpool)(wallets, baseDeltaNumerators)
}
const getTuplesFromWalletsAndNumerators = (fairpool: Fairpool) => (wallets: Address[], baseDeltaNumerators: number[]) => {
  assertEq(wallets.length, baseDeltaNumerators.length, 'wallets.length', 'baseDeltaNumerators.length')
  const quoteDeltas = getQuoteDeltasFromBaseDeltaNumeratorsFullRangeF(fairpool)(baseDeltaNumerators)
  return zip(wallets, quoteDeltas)
}

testFun(async function assertGetQuoteSupplyToBeSemiInvertible() {
  return assertPRD(priceParamsArb, uint256Arb, async (params, baseSupplyProposed) => {
    const { baseLimit, quoteOffset } = params
    const baseSupply = clamp(0n, baseLimit)(baseSupplyProposed)
    const quoteSupplyCalculated = getQuoteSupply(baseLimit, quoteOffset)(baseSupply)
    const baseSupplyCalculated = getBaseSupply(baseLimit, quoteOffset)(quoteSupplyCalculated)
    const baseSupplyDistance = baseSupply - baseSupplyCalculated
    assert.gte(baseSupplyDistance, 0n, 'baseSupplyDistance', '0n')
    assert.lte(baseSupplyDistance, 1n, 'baseSupplyDistance', '1n')
  })
})

testFun(async function assertGetBaseSupplyToBeSemiInvertible() {
  return assertPRD(priceParamsArb, uint256Arb, async (params, quoteSupply) => {
    const { baseLimit, quoteOffset } = params
    // NOTE: quoteSupply doesn't need to be clamped
    input(filename, assertGetBaseSupplyToBeSemiInvertible, params)
    const baseSupplyCalculated = getBaseSupply(baseLimit, quoteOffset)(quoteSupply)
    const quoteSupplyCalculated = getQuoteSupply(baseLimit, quoteOffset)(baseSupplyCalculated)
    inner(filename, assertGetBaseSupplyToBeSemiInvertible, { quoteSupply, baseSupplyCalculated, quoteSupplyCalculated })
    expect(quoteSupplyCalculated).toBeLessThanOrEqual(quoteSupply)
  })
})

testFun(async function assertStaticScenarioToSucceed() {
  const delta = quoteDeltaDefault
  const multiplier = fromNumber(1000)
  const base = getBalancesBase
  const quote = getBalancesQuote
  const check = assertBalanceDiffs(stateDefault)
  run([
    buy(contract, alice, delta),
    check([
      [alice, base, fromNumber(1)],
      [alice, quote, fromNumber(-2)],
      [bob, base, zero],
      [bob, quote, zero],
    ]),
    buy(contract, bob, delta),
    check([
      // equal increments are OK when the baseSupply is close to zero
      [alice, base, fromNumber(1)],
      [alice, quote, fromNumber(-2)],
      [bob, base, fromNumber(1)],
      [bob, quote, fromNumber(-2)],
    ]),
    selloff(contract, bob),
    check([
      [alice, base, fromNumber(1)],
      [alice, quote, fromNumber(-2)],
      [bob, base, zero],
      [bob, quote, zero],
    ]),
    buy(contract, bob, delta * multiplier),
    check([
      // alice execution price is 5, but bob execution price is 8 (higher than alice) due to large size
      [alice, base, fromNumber(1)],
      [alice, quote, fromNumber(-2)],
      [bob, base, fromNumber(599)],
      [bob, quote, fromNumber(-2998)],
    ]),
    selloff(contract, alice),
    selloff(contract, bob),
    check([
      // alice takes profit, bob takes loss
      // alice profit is small because her position size was small
      [alice, base, fromNumber(0)],
      [alice, quote, fromNumber(11)],
      [bob, base, fromNumber(0)],
      [bob, quote, fromNumber(-11)],
    ]),
  ])(stateDefault)
})

test(getQuoteSupplyMax.name, async () => {
  return assertPRD(priceParamsArb, async (params) => {
    const { baseLimit, quoteOffset } = params
    expect(getQuoteSupplyMax(baseLimit, quoteOffset)).toEqual(getQuoteSupplyMaxByDefinition(baseLimit, quoteOffset))
  })
})

test(getQuoteSupplyFor.name, async () => {
  return assertPRD(priceParamsArb, uint256Arb, async (params, baseSupplyProposed) => {
    const { baseLimit, quoteOffset } = params
    const baseSupply = clamp(0n, baseLimit)(baseSupplyProposed)
    const quoteSupplyCalc = getQuoteSupplyFor(baseLimit, quoteOffset)(baseSupply)
    const baseSupplyCalc = getBaseSupply(baseLimit, quoteOffset)(quoteSupplyCalc)
    expect(baseSupplyCalc).toEqual(baseSupply)
  })
})

testFun(async function assertBuySellCycleToReturnInitialBalances() {
  const numerators = getNumeratorsArb(2)
  return assertPRD(stateArb, numerators, async (stateIn, numerators) => {
    const fairpool = getFairpool(stateIn)
    const [quoteDeltaAlice] = getQuoteDeltasFromBaseDeltaNumeratorsFullRangeF(fairpool)(numerators)
    const actions = [
      buy(contract, alice, quoteDeltaAlice),
      selloff(contract, alice),
    ]
    const stateHistory = run(actions)(stateIn)
    const stateOut = last(stateHistory)
    expect(cleanState(stateOut)).toEqual(stateIn)
  })
})

testFun(async function assertAscendingQuoteDeltasForSameBaseDeltas() {
  return assertPRD(stateArb, countArb, async (state, count) => {
    const fairpool = getFairpool(state)
    const baseDelta = (fairpool.baseLimit - 1n) / BigInt(count)
    const baseDeltasMulti = times(count, () => baseDelta)
    const quoteDeltasMulti = getQuoteDeltasFromBaseDeltasF(fairpool)(baseDeltasMulti)
    return isAscendingStrict(quoteDeltasMulti)
  })
})

testFun(async function assertSumOfBuysMustBeLteToBuyOfSums() {
  return assertPRD(stateArb, countArb, async (state, count) => {
    const fairpool = getFairpool(state)
    const baseDeltasMulti = times(count, () => fromNumber(1))
    const quoteDeltasMulti = getQuoteDeltasFromBaseDeltasF(fairpool)(baseDeltasMulti)
    const quoteDeltasSingle = [sum(quoteDeltasMulti)]
    const scenarios = [
      quoteDeltasMulti,
      quoteDeltasSingle,
    ]
    const [amountBaseMulti, amountBaseSingle] = scenarios.map(quoteDeltas => {
      const actions = quoteDeltas.map(quoteDelta => buy(contract, alice, quoteDelta))
      const history = run(actions)(state)
      const amountsHistory = getAmountsHistoryBaseAlice(history)
      return ensure(last(amountsHistory))
    })
    expect(amountBaseMulti).toBeLessThanOrEqual(amountBaseSingle)
  })
})

/**
 * NOTE: assertQuoteOffsetHasInverseInfluenceOnProfit can't be tested reliably because it's difficult to find a pair of quoteDeltaTuple where each quoteDelta is optimal under two different (baseLimit, quoteOffset) pairs
 * higher quoteOffset -> lower profit
 */
// testFun(async function assertQuoteOffsetHasInverseInfluenceOnProfit() {
//   // const minQuoteOffsetIncrement = div(contextDefault.quoteOffset, num(5)) // otherwise the difference between old quoteOffset and new quoteOffset becomes too small
//   // const anyQuoteOffsetIncrement = bigInt({ min: minQuoteOffsetIncrement })
//   const wallets: NonEmptyArray<Address> = [alice, bob]
//   const quoteOffsetAddendArb = quoteOffsetArb
//   const baseDeltaNumeratorsArb = getNumeratorsArb(wallets.length)
//   /* Get a pair of states where states[0].fairpools[0].quoteOffset < states[1].fairpools[0].quoteOffset */
//   const statesWithIncreasingQuoteOffsetArb = record({
//     state: stateArb,
//     quoteOffsetAddend: quoteOffsetAddendArb,
//   })
//     .map(({ state: stateOld, quoteOffsetAddend }) => {
//       const stateNew = clone(stateOld)
//       const [fairpoolOld, fairpoolNew] = [stateOld, stateNew].map(getFairpool)
//       const quoteOffsetAddendClamped = clampIn(0n, quoteOffsetMax - fairpoolNew.quoteOffset)(quoteOffsetAddend)
//       fairpoolNew.quoteOffset = fairpoolNew.quoteOffset + quoteOffsetAddendClamped
//       assert.gte(fairpoolNew.quoteOffset, fairpoolOld.quoteOffset, 'fairpoolNew.quoteOffset', 'fairpoolOld.quoteOffset')
//       return [stateOld, stateNew]
//     })
//     .filter(states => allUnique(states.map(s => getFairpoolQuoteOffset(s))))
//   return assertPRD(statesWithIncreasingQuoteOffsetArb, baseDeltaNumeratorsArb, async (states, baseDeltaNumerators) => {
//     const [stateA, stateB] = states
//     const [fairpoolA, fairpoolB] = states.map(getFairpool)
//     console.log('[fairpoolA, fairpoolB]', [fairpoolA, fairpoolB])
//     const tuples = ensureNonEmptyArray(getTuplesFromWalletsAndNumerators(fairpoolA)(wallets, baseDeltaNumerators))
//     console.log('tuples', tuples)
//     const profits = states.map(getProfitFromTuples(tuples))
//     console.log('profits', profits)
//     // console.log('profits', profits)
//     const deviations = getDeltas(profits)
//     return deviations.every(gte(num(1)))
//   })
// })

/**
 * Not attempting to test assertBaseLimitHasZeroInfluenceOnProfit because of the same issue as with assertQuoteOffsetHasInverseInfluenceOnProfit
 */
// testFun(async function assertBaseLimitHasZeroInfluenceOnProfit() {
//   const wallets: NonEmptyArray<Address> = [alice, bob]
//   const baseDeltaNumeratorsArb = getNumeratorsArb(wallets.length)
//   // return assertRP(baseLimitArb, increasingMultiplierArb, increasingMultiplierArb, baseDeltaNumeratorsArb, async (baseLimit, baseLimitMultiplier, quoteOffsetMultiplier, baseDeltaNumerators) => {
//   // const preContextB = { ...preContextA, quoteOffsetMultiplier: add(quoteOffsetMultiplierIncrement)(preContextA.quoteOffsetMultiplier) }
//   // TODO: Use the same approach with the pairs of states as in the previous test
//   // const baseLimitA = baseLimit
//   // const baseLimitB = pipe(baseLimit, mul(baseLimitMultiplier))
//   // const quoteOffset = pipe(baseLimit, mul(baseLimitMultiplier), mul(quoteOffsetMultiplier))
//   // const contextA = getContext({ baseLimit: baseLimitA, quoteOffset })
//   // const contextB = getContext({ baseLimit: baseLimitB, quoteOffset })
//   // assertBy(lt)(contextA.baseLimit, contextB.baseLimit, 'contextA.baseLimit', 'contextB.baseLimit')
//   const statesArb: Arbitrary<[State, State]> = todo(/* Get a pair of states where states[0].baseLimit < states[1].baseLimit */)
//   return assertPRD(statesArb, baseDeltaNumeratorsArb, async (states, baseDeltaNumerators) => {
//     const [stateA, stateB] = states
//     const [fairpoolA, fairpoolB] = states.map(getFairpool)
//     const quoteDelta = getQuoteDeltaMinF(fairpoolA)
//     const tuples = ensureNonEmptyArray(getTuplesFromWalletsAndNumerators(fairpoolA)(wallets, baseDeltaNumerators))
//     const profits = states.map(getProfitFromTuples(tuples))
//     // console.log('profits', profits)
//     const deviations = getDeltas(profits)
//     return deviations.every(lte(num(1)))
//   })
// })

testFun(async function assertThereExistsSuchAPairOfScenariosWhereTheFirstScenarioGivesAliceZeroProfitButTheSecondScenarioGivesAliceNonZeroProfit() {
  /**
   * This happens due to low quoteDelta
   * When quoteSupply is low, every buy / sell transaction has the same execution price
   * The curve reduces to a line (the formula becomes almost linear)
   */
  // const baseLimit = num(20000)
  // const quoteOffset = num(100000)
  const state = parseState({
    ...stateDefault,
    fairpools: [
      {
        ...stateDefault.fairpools[0],
        baseLimit: fromNumber(100000),
        quoteOffset: fromNumber(200000),
      },
    ],
  })
  const fairpool = getFairpool(state)
  const baseSupplySuperlinearMin = getBaseSupplySuperlinearMinF(fairpool)
  const scenarios = [
    { baseDeltas: [one, one] },
    { baseDeltas: [baseSupplySuperlinearMin, one] },
  ]
  const profits = scenarios.map(({ baseDeltas }) => {
    const [quoteDeltaAlice, quoteDeltaBob] = getQuoteDeltasFromBaseDeltasF(fairpool)(baseDeltas)
    return getProfitFromTuples([
      [alice, quoteDeltaAlice],
      [bob, quoteDeltaBob],
    ])(state)
  })
  expect(profits[0]).toEqual(zero)
  expect(profits[1]).toBeGreaterThan(zero)
})

testFun(async function assertThirdPartyBuyOrdersHaveDirectInfluenceOnProfit() {
  const numeratorsArb = getNumeratorsArb(3)
  const argsArb = record({ state: stateArb, numerators: numeratorsArb }).map(function mapArgs(args) {
    input(filename, mapArgs, args)
    const { state, numerators } = args
    const fairpool = getFairpool(state)
    const upscale = mul(fromNumber(2))
    const baseLimit = fairpool.baseLimit
    const quoteOffset = fairpool.quoteOffset // pipe(fairpool.quoteOffset, upscale, upscale) // NOTE: this is a hack to ensure that baseDeltaMin * numerators.length < baseSupplyMax, some tests may fail if the double upscale is not sufficient
    const baseSupplySuperlinearMin = getBaseSupplySuperlinearMin(baseLimit, quoteOffset)
    inner(filename, mapArgs, { baseLimit, quoteOffset, baseSupplySuperlinearMin })
    const numeratorsNew = sort(numerators, compareNumerals) // ensure that numeratorBob2 is gt numeratorBob1
    const baseSupplySuperlinearRangeLength = baseLimit - baseSupplySuperlinearMin - 1n
    const baseDeltas = getBaseDeltasFromNumerators(baseLimit, quoteOffset)(1n, baseSupplySuperlinearRangeLength)(numeratorsNew)
    baseDeltas[0] += baseSupplySuperlinearMin
    const [quoteDeltaAlice, quoteDeltaBob1, quoteDeltaBob2] = getQuoteDeltasFromBaseDeltas(baseLimit, quoteOffset)(baseDeltas)
    assertTwo(lt)(quoteDeltaBob1, quoteDeltaBob2, 'quoteDeltaBob1', 'quoteDeltaBob2')
    const scenarios = [
      [quoteDeltaAlice, quoteDeltaBob1],
      [quoteDeltaAlice, quoteDeltaBob2],
    ]
    fairpool.baseLimit = baseLimit
    fairpool.quoteOffset = quoteOffset
    return output(filename, mapArgs, {
      state,
      scenarios,
    })
  })
  return assertPRD(argsArb, async function isEveryDeviationOn3rdPartyOrdersGte1(args) {
    input(filename, isEveryDeviationOn3rdPartyOrdersGte1, args)
    const { state, scenarios } = args
    const profits = scenarios.map(([quoteDeltaAlice, quoteDeltaBob]) => {
      return getProfitFromTuples([
        [alice, quoteDeltaAlice],
        [bob, quoteDeltaBob],
      ])(state)
    })
    const deviations = getDeltas(profits)
    expect(deviations.every(gte(fromNumber(1)))).toBeTruthy()
  })
})

testFun.skip(async function assertTalliesNeverChangeInZeroSharesContract() {
  return todo()
})

testFun.skip(async function assertTalliesIncreaseAfterSellInNormalContract() {
  return todo()
})

testFun.skip(async function assertTallyOfSellerIsAlwaysZero() {
  return todo()
})

testFun.skip(async function assertTallyOfSenderIsAlwaysZeroAfterWithdraw() {
  return todo()
})

testFun.skip(async function assertUserCanChangeReferrals() {
  return todo()
})

testFun.skip(async function assertUserCanSetNumeratorsForReferrals() {
  return todo()
})

testFun.skip(async function assertReferralsNumeratorsSumIsLteScale() {
  return todo()
})

testFun.skip(async function assertOwnerCanUpdateShares() {
  return todo()
})

testFun.skip(async function assertOwnerCannotChangeSharesOutsideOfBounds() {
  return todo()
})

testFun.skip(async function assertOwnerCanGiveUpHisRightToUpdateShares() {
  return todo()
})

testFun.skip(async function assertOwnerCanLimitHisRightToUpdateShares() {
  return todo()
})

interface Tax {
  get: (fairpool: Fairpool) => bigint
  set: (fairpool: Fairpool, value: bigint) => Fairpool // may throw an error
  setBounds: (fairpool: Fairpool, bounds: BoundsBI) => Fairpool // may throw an error
}

const taxIsBounded = (fairpool: Fairpool) => (bounds: BoundsBI) => (tax: Tax) => {
  return (nextTaxValue: bigint) => {
    const result = safely(() => tax.set(fairpool, nextTaxValue))
    const outsideOfBounds = !inside(bounds)(nextTaxValue)
    const throwsError = isError(result)
    return outsideOfBounds === throwsError
  }
}

const getTaxes = (fairpool: Fairpool) => todo<Tax[]>()

testFun.skip(async function assertTaxesCanBeFrozen() {
  const frozenTaxValueArb = bigInt()
  const frozenTaxValueDeltaArb = bigInt().filter(v => v !== 0n)
  return assertPRD(stateArb, frozenTaxValueArb, frozenTaxValueDeltaArb, async function (state, frozenTaxValue, frozenTaxValueDelta) {
    const fairpool = getFairpool(state)
    const bounds: BoundsBI = { min: frozenTaxValue, max: frozenTaxValue }
    const taxes = getTaxes(fairpool)
    const fairpoolNew = taxes.reduce((fairpool, tax) => tax.setBounds(fairpool, bounds), fairpool)
    const newTaxValue = frozenTaxValue + frozenTaxValueDelta
    return taxes.map(taxIsBounded(fairpoolNew)(bounds)).every(check => check(newTaxValue))
  })
})

testFun.skip(async function assertTaxesCannotBeFrozenByNonOwner() {

})

testFun.skip(async function assertQuoteReceivedDoesNotDecreaseIfReferralsArrayIsIncreased() {
  const referralsPairArb = todo<Arbitrary<PairOfReferralsSortedAscendingByLength>>()
  return assertPRD(stateArb, referralsPairArb, async function (state, pairOfReferrals) {
    const getTuplesFromReferrals = todo<(referrals: Referral[]) => NonEmptyArray<BalanceDeltaTuple>>()
    const getProfits = (referrals: Referral[]) => {
      const tuples = getTuplesFromReferrals(referrals)
      return getProfitFromTuples(tuples)(state)
    }
    const profits = pairOfReferrals.map(getProfits)
    return isAscending(profits)
  })
})

export const execute = (action: Action) => {
  switch (action.type) {
    case 'buy': return evaluate<Buy>(buyA)(action)
    default: throw new Error(`Unknown action: "${action.type}"`)
  }
}

export const evaluate = <A extends Action>(getActionFunc: (action: A) => ActionFunc) => (action: A) => (prev: State) => {
  const getNext = getActionFunc(action)
  const next = getNext(prev)
  const transition = parseTransition({ action, prev, next })
  validateTransition(transition)
  return next
}

const executeR = (state: State, action: Action) => execute(action)(state)

testFun.skip(async function assertTransitionsAreValid() {
  const actionsArb = todo<Arbitrary<Action[]>>()
  return assertPRD(stateArb, actionsArb, async function (state, actions) {
    return !!actions.reduce(executeR, state) // inline validation
  })
})

// in a contract with non-zero external shares a buy-sell cycle must lead to a decreased quote balance of user
// getQuoteAmount(sender)(started) > getQuoteAmount(sender)(sold),
const history = () => todo<Arbitrary<Shift[]>>()
