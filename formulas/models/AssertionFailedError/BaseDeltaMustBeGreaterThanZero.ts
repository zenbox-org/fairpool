import { AssertionFailedError } from '../../../../utils/error'
import { Amount } from '../Amount'

export class BaseDeltaMustBeGreaterThanZero extends AssertionFailedError<{ baseDelta: Amount }> {}
