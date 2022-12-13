import { expect } from 'libs/utils/chai'
import { todo } from 'libs/utils/todo'
import { sortBy } from 'remeda'
import { Transition } from '../../divide-and-conquer/Transition'
import { ensure, ensureByIndex } from '../../utils/ensure'
import { TokenInfo } from '../models/TokenInfo'
import { SessionParams } from './models/SessionParams'
import { parseState, State } from './models/State'

export interface GetTokenInfos extends SessionParams {
  query?: string
}

export const getTokenInfos: Transition<GetTokenInfos, State> = ({ query, sessionId }) => async (state) => {
  const infosUnsorted = await getTokenInfosUnsorted(query)
  const infos = sortBy(infosUnsorted, t => t.quoteDailyVolume.toNumber())
  state.sessions[sessionId].page = {
    type: 'TokenInfoTable',
    rows: infos.map(data => ({ data, actions: [] })),
  }
  return parseState(state)
}

async function getTokenInfosUnsorted(query: string | undefined) {
  return todo<TokenInfo[]>()
}

const test_getTokenInfos = (params: GetTokenInfos) => async (state: State) => {
  const { sessions } = await getTokenInfos(params)(state)
  if (params.query) {
    const session = ensureByIndex(sessions, params.sessionId)
    if (session.page.type !== 'TokenInfoTable') throw new Error()
    expect(session.page.rows.every(({ data }) => includesCaseInsensitive(data.token.name, ensure(params.query))))
  }
}

const includesCaseInsensitive = (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase())
