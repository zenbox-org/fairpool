import { equals } from 'remeda'
import { validateUpdateViaFilters } from './validateUpdateViaFilters'

const validateUpdatePlainZero1 = <T, A>(prev: T, next: T, action: A) => equals(prev, next) ? [] : [new Error('assert.by(equals)(prev, next)')]

const validateUpdatePlainZero2 = validateUpdateViaFilters([equals])

const validateUpdatePlainZero1_eq_validateUpdatePlainZero2 = <T, A>(prev: T, next: T, action: A) => equals(validateUpdatePlainZero1(prev, next, action), validateUpdatePlainZero2(prev, next, action))
