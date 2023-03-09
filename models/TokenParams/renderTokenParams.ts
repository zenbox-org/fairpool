import { asPercent, toRenderedAmountBNS } from '../../../utils/BigNumber/conversions'
import { num } from '../../../utils/BigNumber/utils'
import { TokenParams } from '../TokenParams'

export const renderBasePercent = (token: TokenParams) => asPercent(toRenderedAmountBNS(token.scale))

export const renderSharePercent = (token: TokenParams) => asPercent(toRenderedAmountBNS(token.scaleOfShares))

export const renderWeightPercent = (token: TokenParams) => asPercent(toRenderedAmountBNS(token.scaleOfWeight))

export const renderWeightAsPower = (token: TokenParams) => {
  const scaleOfWeight = num(token.scaleOfWeight.toString())
  const weight = num(token.weight.toString())
  const power = scaleOfWeight.div(weight).minus(1)
  return power.toFormat(2)
}
