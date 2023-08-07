import { TFunction } from 'next-i18next'
import { toRenderedAmountBNS } from '../../bignumber-bn/conversions'
import { SlopeScale } from '../constants'
import { TokenFieldInfo } from '../models/TokenFieldInfo'
import { TokenParams } from '../models/TokenParams'
import { renderSharePercent, renderWeightAsPower } from '../models/TokenParams/renderTokenParams'

export const allTokenFieldInfos: TokenFieldInfo[] = [
  {
    name: 'earnings',
    render: (token: TokenParams) => renderSharePercent(token)(token.earnings),
  },
  {
    name: 'royalties',
    render: (token: TokenParams) => renderSharePercent(token)(token.royalties),
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
    render: (token: TokenParams, t: TFunction) => t(token.isUpgradeable ? 'yes' : 'no'),
  },
]
