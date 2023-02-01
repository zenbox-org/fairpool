import { Influencer } from '../Influencer'
import { parseTokenParams } from '../TokenParams'
import { BaseDecimals, BaseScale, DefaultSlope, DefaultWeight, ShareScale, WeightScale } from '../../constants'
import { getPercent, getShare } from '../../../bn/utils'
import { ZeroAddress } from '../../../ethereum/data/allAddresses'

export const fromInfluencerToTokenParams = (influencer: Influencer) => parseTokenParams({
  name: `${influencer.title} Token`,
  symbol: influencer.symbol,
  slope: DefaultSlope,
  weight: DefaultWeight,
  royalties: getPercent(BaseScale, 7),
  earnings: getPercent(BaseScale, 25),
  fees: getShare(BaseScale, 25, 1000),
  owner: ZeroAddress,
  operator: ZeroAddress,
  beneficiaries: [{ address: ZeroAddress, share: BaseScale }],
  scale: BaseScale,
  decimals: BaseDecimals,
  scaleOfShares: ShareScale,
  scaleOfWeight: WeightScale,
  isUpgradeable: true,
})
