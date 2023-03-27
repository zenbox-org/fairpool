import { todo } from 'libs/utils/todo'
import { Claims } from './getClaimsViaRequirements'

export const getClaimsFromParserPipes = () => todo<Claims>(undefined, `
  * Return parser pipe objects that allow getting the value from the parent parser from cache
`)
