import { last } from 'remeda'
import { getFairpoolByAddress } from '../../model'
import { isDetrimentalShareForSender } from '../Share/isDetrimentalShareForSender'
import { Shift } from './index'

export const contractHasExternalShares = (shifts: Shift[]) => {
  const shift = last(shifts)
  if (!shift) return true
  const { state, action } = shift
  const { contract, sender } = action
  const fairpool = getFairpoolByAddress(contract)(state)
  return !!fairpool.shares.find(isDetrimentalShareForSender(fairpool)(sender))
}
