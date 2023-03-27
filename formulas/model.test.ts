import { test } from '@jest/globals'
import { ensure } from '../../utils/ensure'
import { getModelAsserter } from './decisions/getModelAsserter'
import { isValidModel } from './helpers/isValidModel'

test.skip(isValidModel.name, () => {
  const asserter = ensure(getModelAsserter())
  asserter({})
})
