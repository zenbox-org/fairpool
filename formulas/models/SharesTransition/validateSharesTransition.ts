import { last } from 'remeda'
import { assertEq, assertIncludes, assertNeq } from '../../../../utils/assert'

import { isNonEmptyArray } from '../../../../utils/NonEmptyArray/predicates'
import { assertNumber } from '../../../../utils/number/NumberAllAssertions'
import { Action, ActionType } from '../Action'
import { AddShare } from '../Action/BaseAction/AddShare'
import { Share } from '../Share'

export const validateSharesTransition = (action: Action) => (prev: Share[], next: Share[]) => {
  const allowedActionTypes: ActionType[] = ['addShare'] // TODO: add setShare* actions
  assertIncludes(allowedActionTypes, action.type, 'allowedActionTypes', 'action.type')
  switch (action.type) {
    case 'addShare': return validateSharesTransitionAddShare(action)(prev, next)
    default: throw new Error()
  }
}

const validateSharesTransitionAddShare = (action: AddShare) => (prev: Share[], next: Share[]) => {
  const lengthDiff = next.length - prev.length
  assertEq(lengthDiff, 1, 'lengthDiff', '1')
  if (!isNonEmptyArray(next)) throw new Error() // type assertion, must never throw because of the check on the previous line
  const share = last(next)
  const rest = next.slice(0, -1)
  assertEq(prev, rest, 'prev', 'rest')
  const parent = next[share.parent]
  assertNumber.lt(share.parent, rest.length, 'share.parent', 'rest.length')
  assertEq(share.owner, action.sender, 'share.owner', 'action.sender')
  assertNeq(share.owner, action.contract, 'share.owner', 'action.contract')
}
