import { expect } from '@jest/globals'
import { chooseOneWrappedSimpleStatic } from 'libs/decimaker/choose'
import { OptionN } from 'libs/decimaker/models/Option'
import { Asserter } from '../../../utils/Asserter'
import { isValidModel } from '../helpers/isValidModel'
import { getClaims } from '../models/Claim/getClaims'
import { getGenerator } from '../models/Generator/Shifts'

export interface Model {}

interface ModelAsserterOption extends OptionN<Asserter<Model>> {

}

export function getModelAsserter() {
  const options: ModelAsserterOption[] = [
    {
      value: (model: Model) => {
        const claims = getClaims()
        const generator = getGenerator()
        expect(isValidModel(claims)(generator)).toBeTruthy()
      },
    },
  ]
  return chooseOneWrappedSimpleStatic(options)
}
