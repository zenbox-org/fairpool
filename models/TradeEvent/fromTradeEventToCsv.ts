import { TradeEvent } from '../TradeEvent'
import { toFrontendAmountBND } from '../../../utils/bignumber.convert'
import { PrevNextMaybe } from '../../../generic/models/PrevNext'
import { BaseDecimals, QuoteDecimals } from '../../constants'

function fromTradeEventToDisplayedStats(trade: TradeEvent) {
  const { baseDelta, quoteDelta, quoteReceived } = trade
  const baseDeltaDisplayed = toFrontendAmountBND(BaseDecimals)(baseDelta)
  const quoteDeltaDisplayed = toFrontendAmountBND(QuoteDecimals)(quoteDelta)
  const quoteReceivedDisplayed = toFrontendAmountBND(QuoteDecimals)(quoteReceived)
  const priceDisplayed = quoteDeltaDisplayed.div(baseDeltaDisplayed)
  return {
    baseDeltaDisplayed,
    quoteDeltaDisplayed,
    quoteReceivedDisplayed,
    priceDisplayed,
  }
}

export const fromTradeEventToCsv = (trade: TradeEvent) => {
  const { sender, isBuy, baseDelta, quoteDelta, quoteReceived } = trade
  const price = quoteDelta.div(baseDelta)
  const { baseDeltaDisplayed, quoteDeltaDisplayed, quoteReceivedDisplayed, priceDisplayed } = fromTradeEventToDisplayedStats(trade)
  return [
    sender,
    isBuy,
    baseDelta,
    quoteDelta,
    price,
    baseDeltaDisplayed,
    quoteDeltaDisplayed,
    quoteReceivedDisplayed,
    priceDisplayed,
  ].map(v => v.toString())
}

function getPriceDisplayedDelta(prev: TradeEvent | undefined, next: TradeEvent) {
  if (!prev) return undefined
  const statsPrev = fromTradeEventToDisplayedStats(prev)
  const statsNext = fromTradeEventToDisplayedStats(next)
  return statsNext.priceDisplayed.minus(statsPrev.priceDisplayed)
}

export const fromTradeEventPairToCsv = (trades: PrevNextMaybe<TradeEvent>) => {
  const { prev, next } = trades
  const { sender, isBuy, baseDelta, quoteDelta, quoteReceived } = next
  const nextArr = fromTradeEventToCsv(next)
  const priceDelta = getPriceDisplayedDelta(prev, next)
  return [
    ...nextArr,
    priceDelta ? priceDelta.toString() : 'N/A',
  ]
}

export const tradeEventCsvColumns = [
  'sender',
  'isBuy',
  'baseDelta',
  'quoteDelta',
  'price',
  'baseDeltaDisplayed',
  'quoteDeltaDisplayed',
  'quoteReceivedDisplayed',
  'priceDisplayed',
]

export const tradeEventPairCsvColumns = [
  ...tradeEventCsvColumns,
  'priceDelta',
]
