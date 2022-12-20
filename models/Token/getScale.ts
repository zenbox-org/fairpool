import { ten } from '../../../bn/constants'
import { Token } from '../Token'

export const getScale = (token: Token) => ten.pow(token.decimals)
