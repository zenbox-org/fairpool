import { concat } from 'lodash-es'
import { identity } from 'remeda'
import { Mutator } from '../../../generic/models/Mutator'
import { rangeBigInt } from '../../../utils/remeda/rangeBigInt'
import { toString } from '../../../utils/string'
import { getBaseSupply, getQuoteSupply } from '../helpers/getSupply'
import { PriceParams } from '../models/PriceParams'

interface ValueStat { value: bigint, valueEnc: bigint, valueEncDec: bigint, diff: bigint, isOptimal: boolean }
interface SupplyStat {baseSupply: ValueStat, quoteSupply: ValueStat}
interface SupplyInfo { input: PriceParams, output: SupplyStat[] }

export const getValueStat = (encode: Mutator<bigint>, decode: Mutator<bigint>) => (value: bigint) => {
  const valueEnc = encode(value)
  const valueEncDec = decode(valueEnc)
  const diff = value - valueEncDec
  const isOptimal = diff === 0n && value !== 0n
  return { value, valueEnc, valueEncDec, diff, isOptimal }
}

export const getSupplyInfo = (scale: bigint) => (baseLimitRaw: bigint, quoteOffsetRaw: bigint) => (start: bigint, end: bigint, multiplier: bigint) => {
  const baseLimit = baseLimitRaw * scale
  const quoteOffset = quoteOffsetRaw * scale
  const toBaseSupply = getBaseSupply(baseLimit, quoteOffset)
  const toQuoteSupply = getQuoteSupply(baseLimit, quoteOffset)
  const getBaseSupplyStat = getValueStat(toQuoteSupply, toBaseSupply)
  const getQuoteSupplyStat = getValueStat(toBaseSupply, toQuoteSupply)
  // console.log('baseLimit, quoteOffset', baseLimit, quoteOffset)
  const input = { baseLimit, quoteOffset }
  const output = rangeBigInt(start, end).map(n => {
    const value = n * multiplier * scale
    return { baseSupply: getBaseSupplyStat(value), quoteSupply: getQuoteSupplyStat(value) }
  })
  return { input, output }
}

export const toStringValueStat = (stat: ValueStat) => {
  const suffixes = [stat.isOptimal ? 'isOptimal' : '-'].filter(identity).join(' ')
  return [stat.value, stat.valueEnc, stat.valueEncDec, stat.diff, suffixes]
}

export const toStringSupplyInfo = (info: SupplyInfo) => {
  // const scale = 1n
  const { input, output: stats } = info
  const lines = stats.map(stat => {
    return concat(toStringValueStat(stat.baseSupply), ['|'], toStringValueStat(stat.quoteSupply))
  })
  // const optimalCount = countBy(stats, s => s.isOptimal)
  // const uniqueCount = uniq(stats.map(s => s.baseSupplyCalc)).length
  // const extras = [
  //   ['optimalCount', optimalCount],
  //   ['uniqueCount', uniqueCount],
  //   // ['quoteSupplyAcceptableMax', quoteSupplyAcceptableMaxScaled],
  // ]
  const extras = [[]]
  const joinS = (line: unknown[]) => line.join(' ')
  const tableToString = (array: unknown[][]) => array.map(joinS).join('\n')
  return [new Date().toISOString(), toString(input), tableToString(lines), tableToString(extras)].join('\n')
}
