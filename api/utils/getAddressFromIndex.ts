import { parseAddress } from '../../../ethereum/models/Address'

export function getAddressFromIndex(index: number) {
  return parseAddress('0x' + index.toString(16).padStart(40, '0'))
}
