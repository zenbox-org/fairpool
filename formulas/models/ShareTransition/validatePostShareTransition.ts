import { omit } from 'remeda'
import { getValidatorTransitionFromMap } from '../../../../divide-and-conquer/models/ValidatorTransitionMap/getValidatorTransitionFromMap'
import { assertEq } from '../../../../utils/assert'
import { todo } from '../../../../utils/todo'
import { Action } from '../Action'
import { Share } from '../Share'

const keysDenied: readonly (keyof Share)[] = ['name', 'parent']

export const validatePostSetShareNumerator = (action: Action) => (prev: Share, next: Share) => {
  const getStatic = omit<keyof Share>(['numerator'])
  const prevStatic = getStatic(prev)
  const nextStatic = getStatic(next)
  assertEq(prevStatic, nextStatic, 'prevStatic', 'nextStatic', { keysAllowed: ['numerator'] }, 'Only some keys are allowed to be modified')
  if (next.parent !== 0) {
    const parent = todo(undefined, 'Need access to parent shares. May work around it by moving the validation up to ShareSchema')
  }
  todo(undefined, 'Ensure that child share numerator cannot get the sum of numerators lower than parent.childrenNumeratorsSum')

  todo(undefined, 'Ensure that child key update keeps the whole children array within parent bounds')
}

const validatePostShareTransition = getValidatorTransitionFromMap<Action['type'], Action, Share>({
  setShareNumerator: validatePostSetShareNumerator,
})
