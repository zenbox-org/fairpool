import { TokenField } from './TokenField'
import { Token } from './Token'
import { TFunction } from 'next-i18next'

export interface TokenFieldInfo {
  name: TokenField
  render: (token: Token, t: TFunction) => string
}
