import { QuotientGen } from '../../../utils/Quotient'
import { GetTalliesDeltaConfig } from './GetTalliesDeltaConfig'

export interface HieroShare {
  getRecipientsConfig: GetTalliesDeltaConfig
  quotient: QuotientGen<bigint>
  children: HieroShare[]
}
