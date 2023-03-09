import { pipe } from 'remeda'
import { BigIntBasicOperations } from '../../utils/bigint/arithmetic'
import { baseLimitMin, quoteOffsetMin } from './constants'
import { getSupplyInfo, toStringSupplyInfo } from './stats/getSupplyInfo'

const { clamp } = BigIntBasicOperations

// const scale = 10n ** 18n
const scale = 1n
const distance = 100n
const midpoint = distance
// const midpoint = 229669658624610460954942584815121872806n
const start = midpoint - distance
const end = midpoint + distance
const multiplier = 1n

export const getExperimentOutputMin = () => pipe(getSupplyInfo(scale)(baseLimitMin, quoteOffsetMin)(start, end, multiplier), toStringSupplyInfo)

export const getExperimentOutputMinQuoteOffsetX2 = () => pipe(getSupplyInfo(scale)(baseLimitMin, quoteOffsetMin * 2n)(start, end, multiplier), toStringSupplyInfo)

export const getExperimentOutputUneven = () => pipe(getSupplyInfo(scale)(baseLimitMin + 237n, quoteOffsetMin * 4n + 142n)(start, end, multiplier), toStringSupplyInfo)

// const baseLimitRaw = 319003563654432218358636302157803748278n
// const quoteSupplyRaw = 332288491163275587987311370471252737742n
//
// export const getExperimentOutputBig = () => pipe(getSupplyInfo(scale)(baseLimitRaw, quoteSupplyRaw)(start, end, multiplier), toStringSupplyInfo)
