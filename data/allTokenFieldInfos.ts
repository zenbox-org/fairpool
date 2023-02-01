import { Token } from '../models/Token'
import { renderSharePercent, renderWeightPercent } from '../../../components/models/TokenSetting/renderTokenSetting'
import { toRenderedAmountBNS } from '../../utils/bignumber.convert'
import { SlopeScale } from '../constants'
import { boolean2string } from '../../utils/conversion'
import { TokenFieldInfo } from '../models/TokenFieldInfo'

export const allTokenFieldInfos: TokenFieldInfo[] = [
  {
    name: 'royalties',
    render: (token: Token) => renderSharePercent(token)(token.royalties),
  },
  {
    name: 'earnings',
    render: (token: Token) => renderSharePercent(token)(token.earnings),
  },
  {
    name: 'fees',
    render: (token: Token) => renderSharePercent(token)(token.fees),
  },
  {
    name: 'slope',
    render: (token: Token) => toRenderedAmountBNS(SlopeScale)(token.slope),
  },
  {
    name: 'weight',
    render: (token: Token) => renderWeightPercent(token)(token.weight),
  },
  {
    name: 'isUpgradeable',
    render: (token: Token) => boolean2string(token.isUpgradeable),
  },
]
