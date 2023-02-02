import { renderSharePercent, renderWeightAsPower } from '../models/TokenParams/renderTokenParams'
import { toRenderedAmountBNS } from '../../utils/bignumber.convert'
import { SlopeScale } from '../constants'
import { boolean2string } from '../../utils/conversion'
import { TokenFieldInfo } from '../models/TokenFieldInfo'
import { TokenParams } from '../models/TokenParams'

export const allTokenFieldInfos: TokenFieldInfo[] = [
  {
    name: 'royalties',
    render: (token: TokenParams) => renderSharePercent(token)(token.royalties),
  },
  {
    name: 'earnings',
    render: (token: TokenParams) => renderSharePercent(token)(token.earnings),
  },
  {
    name: 'fees',
    render: (token: TokenParams) => renderSharePercent(token)(token.fees),
  },
  {
    name: 'slope',
    render: (token: TokenParams) => toRenderedAmountBNS(SlopeScale)(token.slope),
  },
  {
    name: 'weight',
    render: renderWeightAsPower,
  },
  {
    name: 'isUpgradeable',
    render: (token: TokenParams) => boolean2string(token.isUpgradeable),
  },
]
