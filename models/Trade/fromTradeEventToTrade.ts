import { neg } from '../../../bn/utils'
import { parseTrade } from '../Trade'
import { TradeEvent } from '../TradeEvent'

export function fromTradeEventToTrade({ baseDelta, blockHash, blockNumber, isBuy, logIndex, quoteDelta, quoteReceived, sender, transactionHash, transactionIndex, chainId }: TradeEvent) {
  return parseTrade({
    sender,
    baseDelta: isBuy ? baseDelta : neg(baseDelta),
    quoteDelta: isBuy ? neg(quoteDelta) : quoteReceived,
    chainId,
    transactionHash,
    blockNumber,
    // timestamp: block.timestamp * seconds,
  })
}
