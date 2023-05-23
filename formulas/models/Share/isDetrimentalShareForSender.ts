import { todo } from '../../../../utils/todo'
import { Fairpool } from '../Fairpool'
import { Share } from './index'
import { Address } from '../Address'

export const isDetrimentalShareForSender = (fairpool: Fairpool) => (sender: Address) => (share: Share) => todo(undefined, `
  * Must be definitely detrimental (always distribute a non-zero amount to a different address)
`)
