import { InternalCommand } from '../../../utils/fast-check/commands/InternalCommand'
import { todo } from '../../../utils/todo'
import { Address, Amount, buy } from '../uni'
import { Model, Real } from './index'

export class BuyCommand extends InternalCommand<Model, Real> {
  constructor(public contract: Address, public sender: Address, public quoteDeltaProposed: Amount) { super() }

  async check(model: Readonly<Model>) {
    return todo<boolean>()
  }

  async runModel(model: Model) {
    return buy(this.contract, this.sender, this.quoteDeltaProposed)(model)
  }

  async runReal(real: Real) {
    return todo<Model>()
  }
}
