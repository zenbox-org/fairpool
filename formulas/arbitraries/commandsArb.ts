import { commands, constant, constantFrom, record } from 'fast-check'
import { BuyCommand } from '../commands/BuyCommand'
import { contract } from '../default'
import { Address } from '../uni'
import { quoteDeltaRawArb } from './quoteDeltaRawArb'

export const commandsArb = (users: Address[]) => commands([
  record({
    contract: constant(contract),
    sender: constantFrom(...users),
    quoteDeltaProposed: quoteDeltaRawArb,
  }).map(({ contract, sender, quoteDeltaProposed }) => new BuyCommand(contract, sender, quoteDeltaProposed)),
])
