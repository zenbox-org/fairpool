import { renderSharePercent, renderWeightAsPower } from '../models/TokenParams/renderTokenParams'
import { toRenderedAmountBNS } from '../../utils/bignumber.convert'
import { SlopeScale } from '../constants'
import { TokenFieldInfo } from '../models/TokenFieldInfo'
import { TokenParams } from '../models/TokenParams'
import { TFunction } from 'next-i18next'

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
    render: (token: TokenParams, t: TFunction) => t(token.isUpgradeable ? 'yes' : 'no'),
  },
]
