import { test } from '@jest/globals'
import { assert, bigInt, integer, nat, property, record } from 'fast-check'
import { writeFile } from 'fs/promises'
import { countBy, createPipe, identity, last, map, pipe, range, sort, times, uniq } from 'remeda'
import { uint256Max } from '../../bn/constants'
import { getBalancesGenInitial } from '../../finance/models/BalanceGen/getBalancesGenInitial'
import { MutatorV } from '../../generic/models/Mutator'
import { clamp } from '../../utils/arithmetic/clamp'
import { getAssert } from '../../utils/arithmetic/getAssert'
import { getDeltas } from '../../utils/arithmetic/getDeltas'
import { halve as $halve } from '../../utils/arithmetic/halve'
import { isDescending } from '../../utils/arithmetic/isDescending'
import { sum } from '../../utils/arithmetic/sum'
import { ofNumbers } from '../../utils/array/sort'
import { assertBy, assertEq } from '../../utils/assert'
import { BigIntArithmetic } from '../../utils/bigint/BigIntArithmetic'
import { dbgS, debug, input, inter, isLogEnabled, output } from '../../utils/debug'
import { getAssertParametersForReplay } from '../../utils/fast-check/replay'
import { withSkips } from '../../utils/fast-check/withSkips'
import { get__filename } from '../../utils/node'
import { sequentialReducePush, sequentialReduceV } from '../../utils/promise'
import { wrap } from '../../utils/remeda/wrap'
import { getNumeratorsArb } from './arbitraries/getNumeratorsArb'
import { toBoundedArray } from './arbitraries/toBoundedArray'
import { toQuotients } from './arbitraries/toQuotients'
import { Action, Balance, buy, Context, getAmount, getAmountsBQ, getBalancesBQ, getBalancesEvolution, getBaseSupply, getBaseSupplySuperlinearMin, getBaseSupplySuperlinearMinC, getQuoteDeltasFromBaseDeltas, getQuoteDeltasFromBaseDeltasC, getQuoteSupplyAcceptableMaxC, getQuoteSupplyFor, getQuoteSupplyForC, getQuoteSupplyMax, getStats, getTotalSupply, Params, selloff, validateContext, Wallet } from './uni'
import { assertBalances } from './uni.test.helpers'

type N = bigint

interface PreContext<N> {
  baseLimit: N
  quoteOffsetMultiplier: N
}

const arithmetic = BigIntArithmetic
const { zero, one, num, add, sub, mul, div, mod, min, max, abs, sqrt, eq, lt, gt, lte, gte } = arithmetic
const halve = $halve(arithmetic)
const affirm = getAssert(arithmetic) // using a different name because fast-check is using assert
const wallets = ['contract', 'alice', 'bob']
const assets = ['ABC', 'ETH']
const [contract, alice, bob] = wallets
const [base, quote] = assets
const getParams = ({ quoteOffsetMultiplier, baseLimit }: PreContext<N>) => ({ baseLimit, quoteOffset: mul(baseLimit, quoteOffsetMultiplier) })
const getContext = (params: Params<N>): Context<N> => validateContext({ arithmetic, baseAsset: base, quoteAsset: quote, ...params })
const baseLimitConstraints = { min: 1000n, max: uint256Max.toBigInt() }
const quoteOffsetMultiplierConstraints = { min: 2n, max: 200n }
const paramsArb = record<PreContext<N>>({
  quoteOffsetMultiplier: bigInt(quoteOffsetMultiplierConstraints),
  baseLimit: bigInt(baseLimitConstraints),
}).map(getParams)
/**
 * @deprecated
 */
const quoteDeltaConstraints = { min: 1n, max: uint256Max.toBigInt() }
const quoteDeltaMultiplierConstraints = { min: 1n, max: uint256Max.toBigInt() /* should actually be smaller, but we don't know in advance */ }
const contextDefault = getContext({ baseLimit: num(20000), quoteOffset: num(100000) })
const quoteDeltaDefault = getQuoteSupplyForC(contextDefault)(one)
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
const dbgBalancesStats = (balances: Balance<N>[]) => {
  const stats = getBalancesStats(balances)
  dbgS(__filename, 'dbgBalancesStats', 'inter', stats)
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
  const results = sequentialReducePush(mutatorsWithSeparator, ...args)(value)
  debug(__filename, run, '<<<')
  return results
}

const getProfit = (sender: Wallet) => (actions: Action<N>[]) => {
  const balancesEvolution = run(actions)(balancesInitial)
  // console.log('peek', toString(ctx.quoteOffset), toString(ctx.baseLimit), toString(quoteDelta), balancesEvolution.map(getBalancesRendered))
  const balancesFinal = last(balancesEvolution)
  const getAmountLocal = getAmount(quote)(sender)
  const amountInitial = getAmountLocal(balancesInitial)
  const amountFinal = getAmountLocal(balancesFinal)
  return sub(amountFinal, amountInitial)
}
const getActionsToProfitGeneric = (quoteDeltaAlice: N, quoteDeltaBob: N) => (ctx: Context<N>) => {
  return [
    buy(ctx)(contract, alice, quoteDeltaAlice),
    buy(ctx)(contract, bob, quoteDeltaBob),
    selloff(ctx)(contract, alice),
  ].map(wrap(identity, dbgBalancesStats))
}
const getActionsToProfitSimple = (quoteDelta: N) => getActionsToProfitGeneric(quoteDelta, mul(quoteDelta, num(100)))
const getProfitAliceGeneric = (quoteDeltaAlice: N, quoteDeltaBob: N) => (ctx: Context<N>) => getProfit(alice)(getActionsToProfitGeneric(quoteDeltaAlice, quoteDeltaBob)(ctx))
const getProfitAliceSimple = (quoteDelta: N) => (ctx: Context<N>) => getProfit(alice)(getActionsToProfitSimple(quoteDelta)(ctx))

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

if (isLogEnabled) await writeFile('/tmp/stats', getStatsString())

test.skip('must show prices', async () => {
  const baseLimit = 1000000n
  const quoteOffset = 10000n
  const quoteSupplyMaxN = 100
  const quoteSupplyArr = range(1, quoteSupplyMaxN).map(num)
  const baseSupplyArr = quoteSupplyArr.map(getBaseSupply(arithmetic)(baseLimit, quoteOffset))
  const prices = getDeltasA(baseSupplyArr)
  console.info('prices', prices)
  console.info({ baseLimit, quoteOffset, quoteSupplyMaxN })
  prices.map(p => console.info(p))
})

test('a static buy-sell cycle must work as expected', async function testStaticBuySellCycle() {
  // const withAssertAmounts = (action: Action<N>, assert: (balances: Balance<N>[]) => void) => (balancesIn: Balance<N>[]) => {
  //   const balances = action(balancesIn)
  //   assert(balances)
  //   return balances
  // }

  // const withAssertAmountsStatic = (action: Action<N>, tuples: BalanceTuple<N>[]) => withAssertAmounts(action, toAsserter(tuples))
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

/**
   * Currently this happens by definition since sell() has a special case
   */
test.skip('a buy-sell cycle must return initial balances', async () => {
  const anyQuoteDelta = bigInt(quoteDeltaConstraints)
  assert(property(anyQuoteDelta, withSkips((quoteDelta: N) => {
    const actions = [
      buy(contextDefault)(contract, alice, quoteDelta),
      selloff(contextDefault)(contract, alice),
    ]
    const balancesEvolution = run(actions)(balancesInitial)
    const balancesFinal = last(balancesEvolution)
    assertEq(balancesFinal, balancesInitial, 'balancesFinal', 'balancesInitial')
  })), await getAssertParametersForReplay())
})

test.skip('a sequence of buy transactions must give progressively smaller base amounts', async () => {
  const anyCount = nat({ max: 100 })
  const anyQuoteDelta = bigInt(quoteDeltaConstraints)
  assert(property(anyCount, anyQuoteDelta, withSkips((count: number, quoteDelta: N) => {
    const actions = times(count, () => buy(contextDefault)(contract, alice, quoteDelta))
    const balancesEvolution = run(actions)(balancesInitial)
    const amountsBaseSenderEvolution = getAmountsEvolutionBaseAlice(balancesEvolution)
    // const balancesEvolutionBaseSenderRendered = balancesBaseSenderEvolution.map(b => b.amount.toString())
    // console.log('balancesEvolutionBaseSenderRendered', balancesEvolutionBaseSenderRendered)
    return isDescendingA(amountsBaseSenderEvolution)
  })), await getAssertParametersForReplay())
})

test.skip('sum of buys must be almost equal to buy of sums', async () => {
  const anyCount = integer({ min: 1, max: 100 })
  const anyQuoteDelta = bigInt(quoteDeltaConstraints)
  assert(property(anyCount, anyQuoteDelta, withSkips((count: number, quoteDelta: N) => {
    const amountsBaseFinal = [1, count].map(cnt => {
      const quoteDeltaPerAction = div(quoteDelta, num(cnt))
      const actions = times(cnt, () => buy(contextDefault)(contract, alice, quoteDeltaPerAction))
      const balances = sequentialReduceV(actions)(balancesInitial)
      return getAmount(base)(alice)(balances)
    })
    const deviations = getDeltasA(amountsBaseFinal)
    /**
       * small deviations are allowed due to rounding errors
       */
    return deviations.every(lte(num(1)))
  })), await getAssertParametersForReplay())
})

/**
   * higher quoteOffset -> lower profit
   */
test.skip('quoteOffset has inverse influence on profit', async () => {
  const minQuoteOffsetIncrement = div(contextDefault.quoteOffset, num(5)) // otherwise the difference between old quoteOffset and new quoteOffset becomes too small
  const anyQuoteOffsetIncrement = bigInt({ min: minQuoteOffsetIncrement })
  const anyQuoteDelta = bigInt({ ...quoteDeltaConstraints, min: num(100) })
  assert(property(anyQuoteOffsetIncrement, anyQuoteDelta, withSkips((quoteOffsetIncrement: N, quoteDelta: N) => {
    const context0 = contextDefault
    const context1 = { ...contextDefault, quoteOffset: add(contextDefault.quoteOffset, quoteOffsetIncrement) }
    const profits = [context0, context1].map(getProfitAliceSimple(quoteDelta))
    const deviations = getDeltasA(profits)
    return deviations.every(lte(num(-1)))
  })), await getAssertParametersForReplay())
})

test.skip('baseLimit has zero influence on profit', async () => {
  const minBaseLimitIncrement = num(1)
  const anyBaseLimitIncrement = bigInt({ min: minBaseLimitIncrement })
  const anyQuoteDelta = bigInt(quoteDeltaConstraints)
  assert(property(anyBaseLimitIncrement, anyQuoteDelta, withSkips((baseLimitIncrement: N, quoteDelta: N) => {
    const context0 = contextDefault
    const context1 = { ...contextDefault, baseLimit: add(contextDefault.baseLimit, baseLimitIncrement) }
    const profits = [context0, context1].map(getProfitAliceSimple(quoteDelta))
    const deviations = getDeltasA(profits)
    return deviations.every(lte(num(1)))
  })), await getAssertParametersForReplay())
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
    return getProfitAliceGeneric(quoteDeltaAlice, quoteDeltaBob)(context)
  })
  expect(profits[0]).toEqual(zero)
  expect(profits[1]).toBeGreaterThan(zero)
})

test('3rd party buy orders have direct influence on profit', async () => {
  const quoteDeltaMinMultiplierArb = bigInt(quoteDeltaMultiplierConstraints)
  const quoteDeltaBobMultiplierArb = bigInt({ ...quoteDeltaMultiplierConstraints, min: 2n })
  const numeratorsArb = getNumeratorsArb(3)
  const argsArb = record({
    params: paramsArb,
    numerators: numeratorsArb,
    quoteDeltaMinMultiplier: quoteDeltaMinMultiplierArb,
    quoteDeltaBobMultiplier: quoteDeltaBobMultiplierArb,
  }).map(function mapArgs(args) {
    input(__filename, mapArgs, args)
    const { params, numerators, quoteDeltaMinMultiplier, quoteDeltaBobMultiplier } = args
    const upscale = mul(quoteDeltaBobMultiplier)
    const baseLimit = params.baseLimit
    const quoteOffset = pipe(params.quoteOffset, upscale, upscale)
    const baseSupplySuperlinearMin = getBaseSupplySuperlinearMin(arithmetic)(baseLimit, quoteOffset)
    const baseDeltaMin = max(one, baseSupplySuperlinearMin) // yes, max(), because baseDeltaMin must be gte one and gte baseSupplySuperlinearMin, but baseSupplySuperlinearMin may be eq zero
    inter(__filename, mapArgs, { baseLimit, quoteOffset, baseSupplySuperlinearMin })
    const numeratorsNew = sort(numerators, ofNumbers) // ensure that numeratorBob2 is gt numeratorBob1
    const baseLimitHalf = halve(baseLimit)
    const toQuotientsLocal = toQuotients(arithmetic)
    const toBoundedArrayLocal = toBoundedArray(arithmetic)(baseDeltaMin, baseLimitHalf)
    const baseDeltas = pipe(numeratorsNew.map(num), toQuotientsLocal, toBoundedArrayLocal)
    const quoteSupplies = getQuoteDeltasFromBaseDeltas(arithmetic)(baseLimit, quoteOffset)(baseDeltas)
    const quoteSupplyMax = getQuoteSupplyMax(arithmetic)(baseLimit, quoteOffset)
    const quoteDeltaAlice = quoteSupplies[0]
    const [quoteDeltaBob1, quoteDeltaBob2] = getDeltasA(quoteSupplies)
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
      return getProfitAliceGeneric(quoteDeltaAlice, quoteDeltaBob)(context)
    })
    const deviations = getDeltasA(profits)
    expect(deviations.every(gte(num(1)))).toBeTruthy()
  }), await getAssertParametersForReplay({ verbose: true }))
})
