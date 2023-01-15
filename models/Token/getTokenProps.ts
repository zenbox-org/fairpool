import { DefaultRoundingPlaces } from '../../constants'
import { getNetworkSymbolForDisplay } from '../../../../components/utils/getNetworkSymbolForDisplay'
import { DefaultDecimals } from '../../../ethereum/constants'
import { Token } from '../Token'

export function getTokenProps(token: Token) {
  const { address, network, name, symbol, decimals } = token
  const baseSymbol = symbol
  const quoteSymbol = getNetworkSymbolForDisplay(network)
  return {
    ...token,
    baseSymbol,
    baseDecimals: decimals,
    baseRoundingPlaces: DefaultRoundingPlaces,
    baseLabel: baseSymbol,
    quoteSymbol,
    quoteDecimals: DefaultDecimals,
    quoteRoundingPlaces: 6,
    quoteLabel: quoteSymbol,
    networkLabel: network.blockchain.isMainnet ? '' : network.blockchain.label,
  }
}
