import { TokenField } from './TokenField'
import { Token } from './Token'

export interface TokenFieldInfo {
  name: TokenField
  render: (token: Token) => string
}
