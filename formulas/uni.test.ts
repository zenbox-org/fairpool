import { test } from '@jest/globals'
import { assert, asyncProperty, bigInt, integer, nat, property, record } from 'fast-check'
import { countBy, createPipe, identity, last, map, pick, pipe, sort, times, uniq, zip } from 'remeda'
import { uint256Max } from '../../bn/constants'
import { getBalancesGenInitial } from '../../finance/models/BalanceGen/getBalancesGenInitial'
import { MutatorV } from '../../generic/models/Mutator'
import { clamp } from '../../utils/arithmetic/clamp'
import { getAssert } from '../../utils/arithmetic/getAssert'
import { getDeltas } from '../../utils/arithmetic/getDeltas'
import { halve as $halve } from '../../utils/arithmetic/halve'
import { isDescending } from '../../utils/arithmetic/isDescending'
import { sum } from '../../utils/arithmetic/sum'
import { ensureNonEmptyArray, NonEmptyArray } from '../../utils/array/ensureNonEmptyArray'
import { ofNumbers } from '../../utils/array/sort'
import { assertBy, assertEq } from '../../utils/assert'
import { BigIntArithmetic } from '../../utils/bigint/BigIntArithmetic'
import { dbg, dbgS, debug, inner, input, output } from '../../utils/debug'
import { assertR, assertRP, getAssertParametersForReplay } from '../../utils/fast-check/replay'
import { stringify } from '../../utils/JSON'
import { get__filename } from '../../utils/node'
import { sequentialReducePushV } from '../../utils/promise'
import { after } from '../../utils/remeda/wrap'
import { getNumeratorsArb } from './arbitraries/getNumeratorsArb'
import { Action, Balance, buy, Context, getAmount, getAmountsBQ, getBalancesBQ, getBalancesEvolution, getBaseSupplySuperlinearMin, getBaseSupplySuperlinearMinC, getPricesC, getQuoteDeltaMinC, getQuoteDeltasFromBaseDeltaNumeratorsFullRangeC, getQuoteDeltasFromBaseDeltaNumeratorsSuperlinearSafe, getQuoteDeltasFromBaseDeltasC, getQuoteSupplyAcceptableMaxC, getQuoteSupplyFor, getQuoteSupplyForC, getQuoteSupplyMax, getQuoteSupplyMaxByDefinitionC, getQuoteSupplyMaxC, getStats, getTotalSupply, Params, selloff, TallyTuple, validateContext, Wallet } from './uni'
import { assertBalances } from './uni.test.helpers'

type N = bigint

interface PreContext<N> {
  baseLimit: N
  quoteOffsetMultiplier: N
}

const arithmetic = BigIntArithmetic
const { zero, one, num, add, sub, mul, div, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
const halve = $halve(arithmetic)
const affirm = getAssert(arithmetic) // using a different name because fast-check is using assert
const wallets = ['contract', 'alice', 'bob']
const assets = ['ABC', 'ETH']
const [contract, alice, bob] = wallets
const [base, quote] = assets
const getParams = ({ quoteOffsetMultiplier, baseLimit }: PreContext<N>) => ({ baseLimit, quoteOffset: mul(baseLimit, quoteOffsetMultiplier) })
const getContext = (params: Params<N>): Context<N> => validateContext({ arithmetic, baseAsset: base, quoteAsset: quote, ...params })
const getContextFromPreContext = createPipe(getParams, getContext)
const baseLimitConstraints = { min: 1000n, max: uint256Max.toBigInt() }
const quoteOffsetMultiplierConstraints = { min: 2n, max: 200n }
const quoteOffsetMultiplierArb = bigInt(quoteOffsetMultiplierConstraints)
const baseLimitArb = bigInt(baseLimitConstraints)
const preContextArb = record<PreContext<N>>({
  quoteOffsetMultiplier: quoteOffsetMultiplierArb,
  baseLimit: baseLimitArb,
})
const paramsArb = preContextArb.map(getParams)
const contextArb = paramsArb.map(getContext)
const genericMultiplierConstraints = { min: 1n, max: uint256Max.toBigInt() /* should actually be smaller, but we don't know in advance */ }
const increasingMultiplierConstraints = { ...genericMultiplierConstraints, min: 2n }
const increasingMultiplierArb = bigInt(increasingMultiplierConstraints)
const contextDefault = getContext({ baseLimit: num(20000), quoteOffset: num(100000) })
const quoteDeltaDefault = getQuoteDeltaMinC(contextDefault)
// const baseLimit = baseLimitConstraints.min
// const quoteOffset = div(baseLimit, ratio)
// const getContext = (params: )= {
//   arithmetic,
//   baseAsset: base,
//   quoteAsset: quote,
// }
// const quoteDelta = num(100)
const balancesInitial: Balance<N>[] = getBalancesGenInitial(zero)(wallets, assets)
const getDeltasA = getDeltas(arithmetic)
const isDescendingA = isDescending(arithmetic)
const getBalances = getBalancesBQ(base, quote)
const getAmounts = getAmountsBQ(base, quote)
const getBalancesStats = (balances: Balance<N>[]) => ({ alice: getAmounts(alice)(balances), bob: getAmounts(bob)(balances) })
const dbgBalancesStatsAction = (balances: Balance<N>[]) => {
  const stats = getBalancesStats(balances)
  dbgS(__filename, 'dbgBalancesStats', 'inter', stats)
  return balances
}
const getPreContextFromContext = pick<Context<N>, keyof Context<N>>(['baseLimit', 'quoteOffset'])
const dbgContextAction = (context: Context<N>) => (balances: Balance<N>[]) => {
  dbg(__filename, dbgContextAction, 'input', getPreContextFromContext(context))
  return balances
}
const getBalancesEvolutionBaseAlice = getBalancesEvolution<N>(base, alice)
const getAmountsEvolutionBaseAlice = createPipe(getBalancesEvolutionBaseAlice, map(b => b.amount))
const sumAmountsEvolutionBaseAlice = createPipe(getAmountsEvolutionBaseAlice, sum(arithmetic))
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

const getProfitFromActions = (context: Context<N>) => (seller: Wallet) => (actions: Action<N>[]) => {
  const balancesEvolution = run(actions)(balancesInitial)
  const balancesFinal = last(balancesEvolution)
  const getAmountLocal = getAmount(quote)(seller)
  const amountInitial = getAmountLocal(balancesInitial)
  const amountFinal = getAmountLocal(balancesFinal)
  return sub(amountFinal, amountInitial)
}
const getProfitFromTuples = (context: Context<N>) => (tuples: NonEmptyArray<TallyTuple<N>>) => {
  const seller = tuples[0][0]
  const actions = getActionsLeadingToProfit(context)(tuples)
  return getProfitFromActions(context)(seller)(actions)
}
const getActionsLeadingToProfit = (context: Context<N>) => (tuples: NonEmptyArray<TallyTuple<N>>): NonEmptyArray<Action<N>> => {
  const seller = tuples[0][0]
  const buys = tuples.map(([wallet, delta]) => buy(context)(contract, wallet, delta))
  const actions = [
    ...buys,
    selloff(context)(contract, seller),
  ].map(after(dbgBalancesStatsAction))
  return [dbgContextAction(context), ...actions]
}
const getEqualTuplesFromWallets = (context: Context<N>) => (wallets: Wallet[]) => {
  // NOTE: The baseDeltas for each wallet will be equal to (baseLimit - 1) / wallets.length
  const baseDeltaNumerators = wallets.map(_ => 1)
  return getTuplesFromWalletsAndNumerators(context)(wallets, baseDeltaNumerators)
}
const getTuplesFromWalletsAndNumerators = (context: Context<N>) => (wallets: Wallet[], baseDeltaNumerators: number[]) => {
  assertEq(wallets.length, baseDeltaNumerators.length, 'wallets.length', 'baseDeltaNumerators.length')
  const quoteDeltas = getQuoteDeltasFromBaseDeltaNumeratorsFullRangeC(context)(baseDeltaNumerators)
  return zip(wallets, quoteDeltas)
}

export const getStatsString = () => {
  // const scale = 1n
  const context = getContext({ baseLimit: 20000n, quoteOffset: 100000n })
  const quoteSupplyAcceptableMax = getQuoteSupplyAcceptableMaxC(context)
  const scale = 10n ** 18n
  const quoteSupplyOptimalMaxN = parseInt(quoteSupplyAcceptableMax.toString())
  const width = 50
  const start = quoteSupplyOptimalMaxN - width
  const end = quoteSupplyOptimalMaxN + width
  const multiplier = 1
  const stats = getStats(context)(scale)(start, end, multiplier)
  const lines = stats.map((s) => {
    const suffixes = [s.isOptimal ? 'isOptimal' : '', s.isAcceptableMax ? 'isAcceptableMax' : ''].filter(identity).join(' ')
    return [s.baseSupplyCalc, s.quoteSupply, s.quoteSupplyCalc, s.diff, suffixes]
  })
  const optimalCount = countBy(stats, s => s.isOptimal)
  const uniqueCount = uniq(stats.map(s => s.baseSupplyCalc)).length
  const quoteSupplyAcceptableMaxScaled = quoteSupplyAcceptableMax * scale
  const extras = [
    ['optimalCount', optimalCount],
    ['uniqueCount', uniqueCount],
    ['quoteSupplyAcceptableMax', quoteSupplyAcceptableMaxScaled],
  ]
  const joinS = (line: unknown[]) => line.join(' ')
  const tableToString = (array: unknown[][]) => array.map(joinS).join('\n')
  return [new Date().toISOString(), tableToString(lines), tableToString(extras)].join('\n')
}

const getPricesString = (quoteSupplyFrom$: number, quoteSupplyTo$: number) => {
  const context = contextDefault
  const prices = getPricesC(context)(quoteSupplyFrom$, quoteSupplyTo$)
  return [stringify(getPreContextFromContext(context)), prices.join('\n')].join('\n')
}

// if (isLogEnabled) await writeFile('/tmp/stats', getStatsString())

test('a static buy-sell cycle must work as expected', async function testStaticBuySellCycle() {
  const small = quoteDeltaDefault
  const large = mul(small, num(10000))
  run([
    buy(contextDefault)(contract, alice, small),
    assertBalances([
      [alice, base, num(1)],
      [alice, quote, num(-5)],
      [bob, base, zero],
      [bob, quote, zero],
    ]),
    buy(contextDefault)(contract, bob, small),
    assertBalances([
      // equal increments are OK when the baseSupply is close to zero
      [alice, base, num(1)],
      [alice, quote, num(-5)],
      [bob, base, num(1)],
      [bob, quote, num(-5)],
    ]),
    selloff(contextDefault)(contract, bob),
    assertBalances([
      [alice, base, num(1)],
      [alice, quote, num(-5)],
      [bob, base, zero],
      [bob, quote, zero],
    ]),
    buy(contextDefault)(contract, bob, large),
    assertBalances([
      // alice execution price is 5, but bob execution price is 8 (higher than alice) due to large size
      [alice, base, num(1)],
      [alice, quote, num(-5)],
      [bob, base, num(9472)],
      [bob, quote, num(-89982)],
    ]),
    selloff(contextDefault)(contract, alice),
    selloff(contextDefault)(contract, bob),
    assertBalances([
      // alice takes profit, bob takes loss
      // alice profit is small because her position size was small
      [alice, base, num(0)],
      [alice, quote, num(13)],
      [bob, base, num(0)],
      [bob, quote, num(-13)],
    ]),
  ])(balancesInitial)
})

test(getQuoteSupplyMax.name, async () => {
  return assertR(asyncProperty(contextArb, async (context) => {
    expect(getQuoteSupplyMaxC(context)).toEqual(getQuoteSupplyMaxByDefinitionC(context))
  }))
})

test('a buy-sell cycle must return initial balances', async () => {
  const numerators = getNumeratorsArb(2)
  return assertRP(paramsArb, numerators, async (params, numerators) => {
    const context = getContext(params)
    console.log('numerators', numerators)
    const [quoteDeltaAlice] = getQuoteDeltasFromBaseDeltaNumeratorsFullRangeC(context)(numerators)
    console.log('quoteDeltaAlice', quoteDeltaAlice)
    const actions = [
      buy(context)(contract, alice, quoteDeltaAlice),
      selloff(context)(contract, alice),
    ]
    const balancesEvolution = run(actions)(balancesInitial)
    const balancesFinal = last(balancesEvolution)
    assertEq(balancesFinal, balancesInitial, 'balancesFinal', 'balancesInitial')
  })
})

test('a sequence of buy transactions must give progressively smaller base amounts', async () => {
  const countArb = nat({ max: 100 })
  const quoteDeltaMultiplierArb = bigInt(genericMultiplierConstraints)
  return assertRP(paramsArb, countArb, quoteDeltaMultiplierArb, async (params, count, quoteDeltaMultiplier) => {
    const context = getContext(params)
    const baseDeltasMulti = times(count, () => num(1))
    const quoteDeltasMulti = getQuoteDeltasFromBaseDeltasC(context)(baseDeltasMulti)
    const actions = quoteDeltasMulti.map(quoteDelta => buy(context)(contract, alice, quoteDelta))
    const balancesEvolution = run(actions)(balancesInitial)
    const amountsBaseSenderEvolution = getAmountsEvolutionBaseAlice(balancesEvolution)
    // const balancesEvolutionBaseSenderRendered = balancesBaseSenderEvolution.map(b => b.amount.toString())
    // console.log('balancesEvolutionBaseSenderRendered', balancesEvolutionBaseSenderRendered)
    return isDescendingA(amountsBaseSenderEvolution)
  })
})

test('sum of buys must be lte to buy of sums', async () => {
  const countArb = integer({ min: 1, max: 100 })
  const quoteDeltaMultiplierArb = bigInt(genericMultiplierConstraints)
  return assertRP(paramsArb, countArb, quoteDeltaMultiplierArb, async (params, count, quoteDeltaMultiplier) => {
    const context = getContext(params)
    const baseDeltasMulti = times(count, () => num(1))
    const quoteDeltasMulti = getQuoteDeltasFromBaseDeltasC(context)(baseDeltasMulti)
    const quoteDeltasSingle = [sum(arithmetic)(quoteDeltasMulti)]
    const scenarios = [
      quoteDeltasMulti,
      quoteDeltasSingle,
    ]
    const [amountBaseMulti, amountBaseSingle] = scenarios.map(quoteDeltas => {
      const actions = quoteDeltas.map(quoteDelta => buy(context)(contract, alice, quoteDelta))
      const balancesEvolution = run(actions)(balancesInitial)
      const balances = last(balancesEvolution)
      return getAmount(base)(alice)(balances)
    })
    expect(amountBaseMulti).toBeLessThanOrEqual(amountBaseSingle)
  })
})

/**
   * higher quoteOffset -> lower profit
   */
test.skip('quoteOffset has inverse influence on profit', async () => {
  // const minQuoteOffsetIncrement = div(contextDefault.quoteOffset, num(5)) // otherwise the difference between old quoteOffset and new quoteOffset becomes too small
  // const anyQuoteOffsetIncrement = bigInt({ min: minQuoteOffsetIncrement })
  const wallets: NonEmptyArray<Wallet> = [alice, bob]
  const quoteOffsetMultiplierArb = bigInt(increasingMultiplierConstraints)
  const baseDeltaNumeratorsArb = getNumeratorsArb(wallets.length)
  return assertRP(paramsArb, quoteOffsetMultiplierArb, baseDeltaNumeratorsArb, async (params, quoteOffsetMultiplier, baseDeltaNumerators) => {
    const contextA = getContext(params)
    const contextB = { ...contextA, quoteOffset: mul(contextA.quoteOffset, quoteOffsetMultiplier) }
    const quoteDelta = getQuoteDeltaMinC(contextA)
    const tuples = getTuplesFromWalletsAndNumerators(contextB)(wallets, baseDeltaNumerators)
    const profits = [contextA, contextB].map(context => {
      return pipe(
        tuples,
        ensureNonEmptyArray,
        getProfitFromTuples(context),
      )
    })
    console.log('profits', profits)
    const deviations = getDeltasA(profits)
    return deviations.every(lte(num(-1)))
  })
})

test.skip('baseLimit has zero influence on profit', async () => {
  const wallets: NonEmptyArray<Wallet> = [alice, bob]
  const baseDeltaNumeratorsArb = getNumeratorsArb(wallets.length)
  return assertRP(baseLimitArb, increasingMultiplierArb, increasingMultiplierArb, baseDeltaNumeratorsArb, async (baseLimit, baseLimitMultiplier, quoteOffsetMultiplier, baseDeltaNumerators) => {
    // const preContextB = { ...preContextA, quoteOffsetMultiplier: add(quoteOffsetMultiplierIncrement)(preContextA.quoteOffsetMultiplier) }
    const baseLimitA = baseLimit
    const baseLimitB = pipe(baseLimit, mul(baseLimitMultiplier))
    const quoteOffset = pipe(baseLimit, mul(baseLimitMultiplier), mul(quoteOffsetMultiplier))
    const contextA = getContext({ baseLimit: baseLimitA, quoteOffset })
    const contextB = getContext({ baseLimit: baseLimitB, quoteOffset })
    assertBy(lt)(contextA.baseLimit, contextB.baseLimit, 'contextA.baseLimit', 'contextB.baseLimit')
    const quoteDelta = getQuoteDeltaMinC(contextA)
    const tuples = getTuplesFromWalletsAndNumerators(contextA)(wallets, baseDeltaNumerators)
    const profits = [contextA, contextB].map(context => {
      return pipe(
        tuples,
        ensureNonEmptyArray,
        getProfitFromTuples(context),
      )
    })
    console.log('profits', profits)
    const deviations = getDeltasA(profits)
    return deviations.every(lte(num(1)))
  })
})

test(getQuoteSupplyFor.name, async () => {
  const baseSupplyArb = bigInt({ min: 1n, max: uint256Max.toBigInt() })
  assert(property(paramsArb, baseSupplyArb, (params, baseSupplyExpectedIn) => {
    const context = getContext(params)
    const baseSupplyExpected = clamp(context.arithmetic)(one, context.baseLimit)(baseSupplyExpectedIn)
    const quoteSupply = getQuoteSupplyForC(context)(baseSupplyExpected)
    const balances = buy(context)(contract, alice, quoteSupply)(balancesInitial)
    const baseSupplyActual = getTotalSupply(context.arithmetic)(base)(balances)
    expect(baseSupplyActual).toEqual(baseSupplyExpected)
  }), await getAssertParametersForReplay({ verbose: true }))
})

test('there exists such a pair of scenarios where the first scenario gives alice zero profit but the second scenario gives alice non-zero profit', async () => {
  /**
   * This happens due to low quoteDelta
   * When quoteSupply is low, every buy / sell transaction has the same execution price
   * The curve reduces to a line (the formula becomes almost linear)
   */
  // const baseLimit = num(20000)
  // const quoteOffset = num(100000)
  const baseLimit = num(100000)
  const quoteOffset = num(200000)
  const context = getContext({ baseLimit, quoteOffset })
  const baseSupplySuperlinearMin = getBaseSupplySuperlinearMinC(context)
  const scenarios = [
    { baseDeltas: [one, one] },
    { baseDeltas: [baseSupplySuperlinearMin, one] },
  ]
  const profits = scenarios.map(({ baseDeltas }) => {
    const [quoteDeltaAlice, quoteDeltaBob] = getQuoteDeltasFromBaseDeltasC(context)(baseDeltas)
    return getProfitFromTuples(context)([
      [alice, quoteDeltaAlice],
      [bob, quoteDeltaBob],
    ])
  })
  expect(profits[0]).toEqual(zero)
  expect(profits[1]).toBeGreaterThan(zero)
})

test('3rd party buy orders have direct influence on profit', async () => {
  // const quoteOffsetMultiplierArb = bigInt({ ...quoteDeltaMultiplierConstraints, min: 2n })
  const numeratorsArb = getNumeratorsArb(3)
  const argsArb = record({
    params: paramsArb,
    numerators: numeratorsArb,
    // quoteDeltaBobMultiplier: quoteOffsetMultiplierArb,
  }).map(function mapArgs(args) {
    input(__filename, mapArgs, args)
    const { params, numerators } = args
    const upscale = mul(num(2))
    const baseLimit = params.baseLimit
    const quoteOffset = pipe(params.quoteOffset, upscale, upscale) // NOTE: this is a hack to ensure that baseDeltaMin * numerators.length < baseSupplyMax, some tests may fail if the double upscale is not sufficient
    const baseSupplySuperlinearMin = getBaseSupplySuperlinearMin(arithmetic)(baseLimit, quoteOffset)
    inner(__filename, mapArgs, { baseLimit, quoteOffset, baseSupplySuperlinearMin })
    const numeratorsNew = sort(numerators, ofNumbers) // ensure that numeratorBob2 is gt numeratorBob1
    const [quoteDeltaAlice, quoteDeltaBob1, quoteDeltaBob2] = getQuoteDeltasFromBaseDeltaNumeratorsSuperlinearSafe(arithmetic)(baseLimit, quoteOffset)(numeratorsNew)
    assertBy(lt)(quoteDeltaBob1, quoteDeltaBob2, 'quoteDeltaBob1', 'quoteDeltaBob2')
    const scenarios = [
      [quoteDeltaAlice, quoteDeltaBob1],
      [quoteDeltaAlice, quoteDeltaBob2],
    ]
    return output(__filename, mapArgs, { baseLimit, quoteOffset, scenarios })
  })
  assert(property(argsArb, function isEveryDeviationOn3rdPartyOrdersGte1(args) {
    input(__filename, isEveryDeviationOn3rdPartyOrdersGte1, args)
    const { scenarios } = args
    const context = getContext(args)
    const profits = scenarios.map(([quoteDeltaAlice, quoteDeltaBob]) => {
      return getProfitFromTuples(context)([
        [alice, quoteDeltaAlice],
        [bob, quoteDeltaBob],
      ])
    })
    const deviations = getDeltasA(profits)
    expect(deviations.every(gte(num(1)))).toBeTruthy()
  }), await getAssertParametersForReplay({ verbose: true }))
})
