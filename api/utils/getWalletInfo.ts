import { ensureByIndex } from '../../../utils/ensure'
import { State } from '../models/State'

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
  return {
    ...info,
    token: ensureByIndex(state.tokens, params.tokenId),
  }
}
