import { parseBuyEvent } from '../BuyEvent'
import { BuyEvent } from '../../../../typechain-types/artifacts/contracts/Fairpool'

export function fromRawEventToBuyEvent(e: BuyEvent) {
  return parseBuyEvent({
    ...e.args,
    blockNumber: e.blockNumber,
    transactionHash: e.transactionHash,
  })
}
