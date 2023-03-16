import { AssertionFailedError } from '../../../../utils/error'
import { Amount } from '../Amount'

export class QuoteDeltaMustBeGreaterThanZero extends AssertionFailedError<{ quoteDelta: Amount }> {}
