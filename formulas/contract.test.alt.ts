import { map } from '../../decimaker/models/Generator/map'
import { Claim } from '../../programming/models/Claim'
import { req, Requirement } from '../../programming/models/Requirement'
import { isValidRequirement } from '../../programming/models/Requirement/isValidRequirement'
import { History } from '../../utils/History'
import { todo } from '../../utils/todo'
import { Shift } from './models/Shift'

// autoslice
const minLength = todo()

// Define filters on Slices
// some filters work on any history length

const isChain = (history: Shift[]) => todo()

const oneOf = <T>(reqs: Requirement<T>[]) => (history: History<T>) => reqs.some(r => r.filter(history))

const isBuySellCycle = req(3, ([ante, prev, curr]: Shift[]) => todo())

const isBuy = req(2, ([prev, curr]: Shift[]) => todo())

const isSell = req(2, ([prev, curr]: Shift[]) => todo())

const isWithdraw = req(2, ([prev, curr]: Shift[]) => todo())

const isSetOwner = req(2, ([prev, curr]: Shift[]) => todo())

const isValidAction = req(2, oneOf(todo([
  isBuy,
  isSell,
  isWithdraw,
  isSetOwner,
], 'Add more action filters')))

const isValidClaim = (history: Shift[]) => ({ premises, conclusion }: Claim<Shift>) => {
  const isValid = isValidRequirement(history)
  return !premises.every(isValid) || isValid(conclusion)
}

type Test = (claims: Claim<Shift>[]) => (generator: Generator<Shift[]>) => boolean[]

const test: Test = (claims: Claim<Shift>[]) => map((history: Shift[]) => claims.every(isValidClaim(history)))

const senderIsOwner = req(2, ([prev, curr]: Shift[]) => todo())

const senderOfSetOwnerMustBeOwner: Claim<Shift> = {
  premises: [isSetOwner],
  conclusion: senderIsOwner,
}

const tst = (name: string) => todo()

const tests = [
  tst('Every share value must be within its bounds'),
]
