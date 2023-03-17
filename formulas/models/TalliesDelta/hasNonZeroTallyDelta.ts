import { Address } from '../../../../ethereum/models/Address'
import { TalliesDelta } from './index'

export const hasNonZeroTallyDelta = (address: Address) => (deltas: TalliesDelta[]) => {
  const delta = deltas.find(d => d.address === address)
  return delta && delta.amount > 0
}
