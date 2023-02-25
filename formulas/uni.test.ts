import { test } from '@jest/globals'
import { array, bigInt, constant, constantFrom, integer, nat, record, tuple } from 'fast-check'
import { Arbitrary } from 'fast-check/lib/types/check/arbitrary/definition/Arbitrary'
import { clone, createPipe, last, map, sort, times, zip } from 'remeda'
import { uint256Max } from '../../bn/constants'
import { MutatorV } from '../../generic/models/Mutator'
import { clamp as $clamp, clampIn as $clampIn } from '../../utils/arithmetic/clamp'
import { getAssert } from '../../utils/arithmetic/getAssert'
import { getDeltas as $getDeltas } from '../../utils/arithmetic/getDeltas'
import { getShare as $getShare } from '../../utils/arithmetic/getShare'
import { halve as $halve } from '../../utils/arithmetic/halve'
import { isDescending as $isDescending } from '../../utils/arithmetic/isDescending'
import { sum } from '../../utils/arithmetic/sum'
import { ensureNonEmptyArray, NonEmptyArray } from '../../utils/array/ensureNonEmptyArray'
import { assertBy, assertEq } from '../../utils/assert'
import { BigIntArithmetic } from '../../utils/bigint/BigIntArithmetic'
import { dbg, dbgS, debug, inner, input, output } from '../../utils/debug'
import { ensure } from '../../utils/ensure'
import { assertPRD } from '../../utils/fast-check/assert'
import { testFun } from '../../utils/jest/testFun'
import { get__filename } from '../../utils/node'
import { compareNumerals } from '../../utils/numeral/sort'
import { sequentialReducePushV } from '../../utils/promise'
import { after } from '../../utils/remeda/wrap'
import { todo } from '../../utils/todo'
import { fromNumeratorsToValues as $fromNumeratorsToValues } from './arbitraries/fromNumeratorsToValues'
import { getNumeratorsArb } from './arbitraries/getNumeratorsArb'
import { toBoundedArray as $toBoundedArray } from './arbitraries/toBoundedArray'
import { toQuotients as $toQuotients } from './arbitraries/toQuotients'
import { assertBalanceDiffs } from './assertBalanceDiffs'
import { cleanState } from './clean'
import { priceParamMax, priceParamMin, quoteOffsetMin, quoteOffsetMultiplierMaxGetter, quoteOffsetMultiplierMin, scaleFixed } from './constants'
import { getAmountD, getAmountsBQ, getBalanceD, getBalancesBQ, logState } from './helpers'
import { Action, Address, Balance, BalanceTuple, Beneficiary, Blockchain, buy, Context, DistributionParams, Fairpool, getBalancesBase, getBalancesLocalD, getBalancesQuote, getBaseDeltasFromNumerators, getBaseSupply, getBaseSupplySuperlinearMin, getBaseSupplySuperlinearMinF, getFairpool, getPricingParamsFromFairpool, getQuoteDeltaMinF, getQuoteDeltasFromBaseDeltaNumeratorsFullRangeF, getQuoteDeltasFromBaseDeltas, getQuoteDeltasFromBaseDeltasF, getQuoteSupply, getQuoteSupplyFor, getQuoteSupplyMax, getQuoteSupplyMaxByDefinition, PrePriceParams, PriceParams, selloff, State } from './uni'
import { validateFairpool } from './validateFairpool'
import { validatePricingParams } from './validatePricingParams'
import { fairpoolZero } from './zero'

const arithmetic = BigIntArithmetic
const { zero, one, num, add, sub, mul, div, mod, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
const assert = getAssert(arithmetic)
const halve = $halve(arithmetic)
const getShare = $getShare(arithmetic)
const toQuotients = $toQuotients(arithmetic)
const toBoundedArray = $toBoundedArray(arithmetic)
const fromNumeratorsToValues = $fromNumeratorsToValues(arithmetic)
const clamp = $clamp(arithmetic)
const clampIn = $clampIn(arithmetic)
const getDeltas = $getDeltas(arithmetic)
const isDescending = $isDescending(arithmetic)
const users = ['alice', 'bob', 'sam', 'ted']
const addresses = ['contract', ...users]
const assets = ['base', 'quote']
const [contract, alice, bob, sam, ted] = addresses
const [base, quote] = assets

/** helpers */
const getPricingParams = ({ quoteOffsetMultiplierProposed, baseLimit }: PrePriceParams) => {
  const quoteOffsetMultiplierMax = quoteOffsetMultiplierMaxGetter(baseLimit)
  const quoteOffsetMultiplier = clampIn(quoteOffsetMultiplierMin, quoteOffsetMultiplierMax)(quoteOffsetMultiplierProposed)
  return ({
    baseLimit,
    quoteOffset: mul(baseLimit, quoteOffsetMultiplier),
  })
}
const getContext = (params: PriceParams): Context => ({ arithmetic, baseAsset: base, quoteAsset: quote, ...params })
const getStateFromPreState = createPipe(getPricingParams, getContext)
const getBalances = getBalancesBQ(base, quote)
const getAmounts = getAmountsBQ(base, quote)

// const baseLimitConstraints = { min: baseLimitMin, max: baseLimitMax }
// const quoteOffsetConstraints = { min: quoteOffsetMin, max: quoteOffsetMax }
const priceParamConstraints = { min: priceParamMin, max: priceParamMax }
const quoteOffsetMultiplierConstraints = { min: quoteOffsetMultiplierMin }
const genericMultiplierConstraints = { min: 1n, max: uint256Max.toBigInt() /* should actually be smaller, but we don't know in advance */ }
const increasingMultiplierConstraints = { ...genericMultiplierConstraints, min: 2n }

const balancesDefault: Balance[] = []
const getShareScaledDefault = getShare(scaleFixed)
const getShareScaledDefaultPips = getShareScaledDefault(num(10000))
const fairpoolDefault: Fairpool = validateFairpool(balancesDefault)({
  ...fairpoolZero,
  quoteOffset: 2n * quoteOffsetMin,
  address: contract,
  quoteSupply: zero,
  beneficiaries: [{ address: sam, share: scaleFixed }],
  owner: sam,
  operator: ted,
  royalties: getShareScaledDefaultPips(num(2000)),
  earnings: getShareScaledDefaultPips(num(7500)),
  fees: getShareScaledDefaultPips(num(2500)),
  holdersPerDistributionMax: num(256),
})
const blockchainDefault: Blockchain = {
  balances: balancesDefault,
}
const stateDefault: State = {
  blockchain: blockchainDefault,
  fairpools: [fairpoolDefault],
}
const quoteDeltaDefault = getQuoteDeltaMinF(fairpoolDefault)

// const baseLimitArb = bigInt(baseLimitConstraints)
// const quoteOffsetMultiplierProposedArb = bigInt(quoteOffsetMultiplierConstraints)
// const prePricingParamsArb = record<PrePricingParams>({
//   quoteOffsetMultiplierProposed: quoteOffsetMultiplierProposedArb,
//   baseLimit: baseLimitArb,
// })
const toSortedBaseLimitQuoteOffset = sort<bigint>(compareNumerals)
const priceParamArb = bigInt(priceParamConstraints)
const priceParamsArb = tuple(priceParamArb, priceParamArb).map(toSortedBaseLimitQuoteOffset).map(([baseLimit, quoteOffset]) => ({ baseLimit, quoteOffset }))
const uint256Arb = bigInt({ min: 0n, max: uint256Max.toBigInt() })
const supplyStatArb = record({
  params: priceParamsArb,
  supply: uint256Arb,
}).map(({ params: { baseLimit, quoteOffset }, supply }) => ({
  baseLimit,
  quoteOffset,
  supply: clamp(0n, baseLimit)(supply),
}))
const getScaledValuesArb = (length: number) => getNumeratorsArb(length, 0).map(fromNumeratorsToValues(0n, scaleFixed))
const getBeneficiariesArb = (addresses: Address[]): Arbitrary<Beneficiary[]> => {
  return getScaledValuesArb(addresses.length).map(shares => {
    return zip(addresses, shares).map(([address, share]) => ({ address, share }))
  })
}
const distributionParamsArb: Arbitrary<DistributionParams> = getScaledValuesArb(3).map(distributionParams => ({
  royalties: distributionParams[0],
  earnings: distributionParams[1],
  fees: distributionParams[2],
}))
const fairpoolArb = (users: Address[]) => record({
  priceParams: priceParamsArb,
  beneficiaries: getBeneficiariesArb(users),
  owner: constantFrom(...users),
  operator: constantFrom(...users),
  distributionParams: distributionParamsArb,
}).map(fairpool => ({
  ...fairpoolZero,
  ...fairpool,
  address: contract,
  ...fairpool.priceParams,
  ...fairpool.distributionParams,
}))
const getStateArb = (users: Address[]) => record<State>({
  fairpools: array(fairpoolArb(users), { minLength: 1, maxLength: 1 }),
  blockchain: constant(blockchainDefault),
})
const stateArb = getStateArb(users)
const increasingMultiplierArb = bigInt(increasingMultiplierConstraints)

const getBalancesStats = (state: State) => getBalancesLocalD([alice, bob])(getFairpool(state), state.blockchain)
const dbgBalancesStatsAction = (state: State) => {
  const stats = getBalancesStats(state)
  dbgS(__filename, 'dbgBalancesStats', 'inter', stats)
  return state
}
const dbgContextAction = (state: State) => {
  dbg(__filename, dbgContextAction, 'input', getPricingParamsFromFairpool(state.fairpools[0]))
  return state
}
const getBalancesHistoryBaseAlice = createPipe(map(getBalancesBase), map(getBalanceD(alice)))
const getAmountsHistoryBaseAlice = createPipe(getBalancesHistoryBaseAlice, map((b: Balance) => b.amount))
const sumAmountsHistoryBaseAlice = createPipe(getAmountsHistoryBaseAlice, sum(arithmetic))
const __filename = get__filename(import.meta.url)
const run = <Val, Args extends unknown[]>(mutators: MutatorV<Val, Args>[], ...args: Args) => (value: Val) => {
  const mutatorsWithSeparator = mutators.map<MutatorV<Val, Args>>(mutator => (obj, ...args) => {
    debug(__filename, run, '>>>')
    // debug(__filename, run, getBalancesStats(obj))
    return mutator(obj, ...args)
  })
  const results = sequentialReducePushV(mutatorsWithSeparator, ...args)(value)
  debug(__filename, run, '<<<')
  return results
}

const getProfitFromActions = (seller: Address) => (actions: Action[]) => (stateInitial: State) => {
  const history = run(actions)(stateInitial)
  const stateFinal = last(history)
  const getAmountLocalD = getAmountD(seller)
  const amountInitial = getAmountLocalD(stateInitial.blockchain.balances)
  const amountFinal = getAmountLocalD(stateFinal.blockchain.balances)
  return sub(amountFinal, amountInitial)
}
const getProfitFromTuples = (tuples: NonEmptyArray<BalanceTuple>) => {
  const seller = tuples[0][0]
  const actions = getActionsLeadingToProfit(tuples)
  return getProfitFromActions(seller)(actions)
}
const getActionsLeadingToProfit = (tuples: NonEmptyArray<BalanceTuple>): NonEmptyArray<Action> => {
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
    const { baseLimit, quoteOffset } = validatePricingParams(params)
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
    const { baseLimit, quoteOffset } = validatePricingParams(params)
    // NOTE: quoteSupply doesn't need to be clamped
    input(__filename, assertGetBaseSupplyToBeSemiInvertible, params)
    const baseSupplyCalculated = getBaseSupply(baseLimit, quoteOffset)(quoteSupply)
    const quoteSupplyCalculated = getQuoteSupply(baseLimit, quoteOffset)(baseSupplyCalculated)
    inner(__filename, assertGetBaseSupplyToBeSemiInvertible, { quoteSupply, baseSupplyCalculated, quoteSupplyCalculated })
    expect(quoteSupplyCalculated).toBeLessThanOrEqual(quoteSupply)
  })
})

testFun(async function assertStaticScenarioToSucceed() {
  const delta = quoteDeltaDefault
  const multiplier = num(1000)
  const base = getBalancesBase
  const quote = getBalancesQuote
  const check = assertBalanceDiffs(stateDefault)
  run([
    buy(contract, alice, delta),
    check([
      [alice, base, num(1)],
      [alice, quote, num(-2)],
      [bob, base, zero],
      [bob, quote, zero],
    ]),
    buy(contract, bob, delta),
    check([
      // equal increments are OK when the baseSupply is close to zero
      [alice, base, num(1)],
      [alice, quote, num(-2)],
      [bob, base, num(1)],
      [bob, quote, num(-2)],
    ]),
    selloff(contract, bob),
    logState,
    check([
      [alice, base, num(1)],
      [alice, quote, num(-2)],
      [bob, base, zero],
      [bob, quote, zero],
    ]),
    buy(contract, bob, delta * multiplier),
    check([
      // alice execution price is 5, but bob execution price is 8 (higher than alice) due to large size
      [alice, base, num(1)],
      [alice, quote, num(-2)],
      [bob, base, num(599)],
      [bob, quote, num(-2998)],
    ]),
    selloff(contract, alice),
    selloff(contract, bob),
    check([
      // alice takes profit, bob takes loss
      // alice profit is small because her position size was small
      [alice, base, num(0)],
      [alice, quote, num(11)],
      [bob, base, num(0)],
      [bob, quote, num(-11)],
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

testFun(async function assertBuyTransactionsToGiveProgressivelySmallerBaseAmounts() {
  const countArb = nat({ max: 100 })
  const quoteDeltaMultiplierArb = bigInt(genericMultiplierConstraints)
  return assertPRD(stateArb, countArb, quoteDeltaMultiplierArb, async (state, count, quoteDeltaMultiplier) => {
    logState(state)
    const fairpool = getFairpool(state)
    const baseDeltasMulti = times(count, () => num(1))
    const quoteDeltasMulti = getQuoteDeltasFromBaseDeltasF(fairpool)(baseDeltasMulti)
    const actions = quoteDeltasMulti.map(quoteDelta => buy(contract, alice, quoteDelta))
    const history = run(actions)(state)
    const amountsBaseSenderHistory = getAmountsHistoryBaseAlice(history)
    return isDescending(amountsBaseSenderHistory)
  })
})

testFun(async function assertSumOfBuysMustBeLteToBuyOfSums() {
  const countArb = integer({ min: 1, max: 100 })
  return assertPRD(stateArb, countArb, async (state, count) => {
    const fairpool = getFairpool(state)
    const baseDeltasMulti = times(count, () => num(1))
    const quoteDeltasMulti = getQuoteDeltasFromBaseDeltasF(fairpool)(baseDeltasMulti)
    const quoteDeltasSingle = [sum(arithmetic)(quoteDeltasMulti)]
    const scenarios = [
      quoteDeltasMulti,
      quoteDeltasSingle,
    ]
    console.log('scenarios', scenarios)
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
   * higher quoteOffset -> lower profit
   */
testFun(async function assertQuoteOffsetHasInverseInfluenceOnProfit() {
  // const minQuoteOffsetIncrement = div(contextDefault.quoteOffset, num(5)) // otherwise the difference between old quoteOffset and new quoteOffset becomes too small
  // const anyQuoteOffsetIncrement = bigInt({ min: minQuoteOffsetIncrement })
  const wallets: NonEmptyArray<Address> = [alice, bob]
  const quoteOffsetMultiplierArb = bigInt(increasingMultiplierConstraints)
  const baseDeltaNumeratorsArb = getNumeratorsArb(wallets.length)
  const statesArb: Arbitrary<[State, State]> = todo(/* Get a pair of states where states[0].quoteOffset < states[1].quoteOffset */)
  return assertPRD(statesArb, quoteOffsetMultiplierArb, baseDeltaNumeratorsArb, async (states, quoteOffsetMultiplier, baseDeltaNumerators) => {
    // const contextB = { ...stateA, quoteOffset: mul(stateA.quoteOffset, quoteOffsetMultiplier) }
    const [stateA, stateB] = states
    const [fairpoolA, fairpoolB] = states.map(getFairpool)
    const quoteDelta = getQuoteDeltaMinF(fairpoolA)
    const tuples = ensureNonEmptyArray(getTuplesFromWalletsAndNumerators(fairpoolB)(wallets, baseDeltaNumerators))
    const profits = states.map(getProfitFromTuples(tuples))
    // console.log('profits', profits)
    const deviations = getDeltas(profits)
    return deviations.every(lte(num(-1)))
  })
})

test.skip('baseLimit has zero influence on profit', async () => {
  const wallets: NonEmptyArray<Address> = [alice, bob]
  const baseDeltaNumeratorsArb = getNumeratorsArb(wallets.length)
  // return assertRP(baseLimitArb, increasingMultiplierArb, increasingMultiplierArb, baseDeltaNumeratorsArb, async (baseLimit, baseLimitMultiplier, quoteOffsetMultiplier, baseDeltaNumerators) => {
  // const preContextB = { ...preContextA, quoteOffsetMultiplier: add(quoteOffsetMultiplierIncrement)(preContextA.quoteOffsetMultiplier) }
  // TODO: Use the same approach with the pairs of states as in the previous test
  // const baseLimitA = baseLimit
  // const baseLimitB = pipe(baseLimit, mul(baseLimitMultiplier))
  // const quoteOffset = pipe(baseLimit, mul(baseLimitMultiplier), mul(quoteOffsetMultiplier))
  // const contextA = getContext({ baseLimit: baseLimitA, quoteOffset })
  // const contextB = getContext({ baseLimit: baseLimitB, quoteOffset })
  // assertBy(lt)(contextA.baseLimit, contextB.baseLimit, 'contextA.baseLimit', 'contextB.baseLimit')
  const statesArb: Arbitrary<[State, State]> = todo(/* Get a pair of states where states[0].baseLimit < states[1].baseLimit */)
  return assertPRD(statesArb, baseDeltaNumeratorsArb, async (states, baseDeltaNumerators) => {
    const [stateA, stateB] = states
    const [fairpoolA, fairpoolB] = states.map(getFairpool)
    const quoteDelta = getQuoteDeltaMinF(fairpoolA)
    const tuples = ensureNonEmptyArray(getTuplesFromWalletsAndNumerators(fairpoolA)(wallets, baseDeltaNumerators))
    const profits = states.map(getProfitFromTuples(tuples))
    // console.log('profits', profits)
    const deviations = getDeltas(profits)
    return deviations.every(lte(num(1)))
  })
})

testFun(async function expectThereExistsSuchAPairOfScenariosWhereTheFirstScenarioGivesAliceZeroProfitButTheSecondScenarioGivesAliceNonZeroProfit() {
  /**
   * This happens due to low quoteDelta
   * When quoteSupply is low, every buy / sell transaction has the same execution price
   * The curve reduces to a line (the formula becomes almost linear)
   */
  // const baseLimit = num(20000)
  // const quoteOffset = num(100000)
  const state = clone(stateDefault)
  state.fairpools[0] = validateFairpool(state.blockchain.balances)({
    ...state.fairpools[0],
    baseLimit: num(100000),
    quoteOffset: num(200000),
  })
  const fairpool = getFairpool(state)
  const baseSupplySuperlinearMin = getBaseSupplySuperlinearMinF(fairpool)
  const scenarios = [
    { baseDeltas: [one, one] },
    { baseDeltas: [baseSupplySuperlinearMin, one] },
  ]
  const profits = scenarios.map(({ baseDeltas }) => {
    const [quoteDeltaAlice, quoteDeltaBob] = getQuoteDeltasFromBaseDeltasF(fairpool)(baseDeltas)
    console.log('[quoteDeltaAlice, quoteDeltaBob]', [quoteDeltaAlice, quoteDeltaBob])
    return getProfitFromTuples([
      [alice, quoteDeltaAlice],
      [bob, quoteDeltaBob],
    ])(state)
  })
  expect(profits[0]).toEqual(zero)
  expect(profits[1]).toBeGreaterThan(zero)
})

testFun(async function expectThirdPartyBuyOrdersHaveDirectInfluenceOnProfit() {
  const numeratorsArb = getNumeratorsArb(3)
  const argsArb = record({ state: stateArb, numerators: numeratorsArb }).map(function mapArgs(args) {
    input(__filename, mapArgs, args)
    const { state, numerators } = args
    const fairpool = getFairpool(state)
    const upscale = mul(num(2))
    const baseLimit = fairpool.baseLimit
    const quoteOffset = fairpool.quoteOffset // pipe(fairpool.quoteOffset, upscale, upscale) // NOTE: this is a hack to ensure that baseDeltaMin * numerators.length < baseSupplyMax, some tests may fail if the double upscale is not sufficient
    const baseSupplySuperlinearMin = getBaseSupplySuperlinearMin(baseLimit, quoteOffset)
    inner(__filename, mapArgs, { baseLimit, quoteOffset, baseSupplySuperlinearMin })
    const numeratorsNew = sort(numerators, compareNumerals) // ensure that numeratorBob2 is gt numeratorBob1
    const baseSupplySuperlinearRangeLength = baseLimit - baseSupplySuperlinearMin - 1n
    const baseDeltas = getBaseDeltasFromNumerators(baseLimit, quoteOffset)(1n, baseSupplySuperlinearRangeLength)(numeratorsNew)
    baseDeltas[0] += baseSupplySuperlinearMin
    const [quoteDeltaAlice, quoteDeltaBob1, quoteDeltaBob2] = getQuoteDeltasFromBaseDeltas(baseLimit, quoteOffset)(baseDeltas)
    assertBy(lt)(quoteDeltaBob1, quoteDeltaBob2, 'quoteDeltaBob1', 'quoteDeltaBob2')
    const scenarios = [
      [quoteDeltaAlice, quoteDeltaBob1],
      [quoteDeltaAlice, quoteDeltaBob2],
    ]
    fairpool.baseLimit = baseLimit
    fairpool.quoteOffset = quoteOffset
    return output(__filename, mapArgs, {
      state,
      scenarios,
    })
  })
  return assertPRD(argsArb, async function isEveryDeviationOn3rdPartyOrdersGte1(args) {
    input(__filename, isEveryDeviationOn3rdPartyOrdersGte1, args)
    const { state, scenarios } = args
    const profits = scenarios.map(([quoteDeltaAlice, quoteDeltaBob]) => {
      return getProfitFromTuples([
        [alice, quoteDeltaAlice],
        [bob, quoteDeltaBob],
      ])(state)
    })
    const deviations = getDeltas(profits)
    expect(deviations.every(gte(num(1)))).toBeTruthy()
  })
})
