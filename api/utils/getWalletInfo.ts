import { ensureByIndex } from '../../../utils/ensure'
import { getTotalSupply } from '../../models/Token/getTotalSupply'
import { State } from '../models/State'
import { getBalanceD } from './getBalanceD'

interface SessionInfoParams {
  sessionId: number,
}

interface WalletInfoParams extends SessionInfoParams {
  walletId: number
}

interface TokenInfoParams extends WalletInfoParams {
  tokenId: number
}

export function getSessionInfo(params: SessionInfoParams, state: State) {
  const session = ensureByIndex(state.sessions, params.sessionId)
  const user = ensureByIndex(state.users, session.userId)
  return {
    session,
    user,
  }
}

export function getWalletInfo(params: WalletInfoParams, state: State) {
  const info = getSessionInfo(params, state)
  const wallet = ensureByIndex(state.wallets, params.walletId)
  return {
    ...info,
    wallet,
  }
}

export function getTokenInfo(params: TokenInfoParams, state: State) {
  const info = getWalletInfo(params, state)
  const token = ensureByIndex(state.tokens, params.tokenId)
  const balance = getBalanceD(token, info.wallet.address)
  // const walletOfToken = ensureFind(state.wallets, w => w.address === token.address)
  return {
    ...info,
    token,
    balance,
    // walletOfToken,
  }
}

export const getToken = (params: TokenInfoParams, state: State) => getTokenInfo(params, state).token

export const getTokenTotalSupply = (params: TokenInfoParams, state: State) => getTotalSupply(getToken(params, state))
