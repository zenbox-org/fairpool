import { expect } from 'libs/utils/chai'
import { todo } from 'libs/utils/todo'
import { sortBy } from 'remeda'
import { Transition } from '../../divide-and-conquer/Transition'
import { ensure, ensureByIndex } from '../../utils/ensure'
import { SessionParams } from './models/SessionParams'
import { parseState, State } from './models/State'
import { Token } from '../models/Token'

export interface GetTokens extends SessionParams {
  query?: string
}

export const getTokens: Transition<GetTokens, State> = ({ query, sessionId }) => async (state) => {
  const infosUnsorted = await getTokensUnsorted(query)
  const infos = sortBy(infosUnsorted, t => t.quoteDailyVolume.toNumber())
  state.sessions[sessionId].page = {
    type: 'TokenInfoTable',
    rows: infos.map(data => ({ data, actions: [] })),
  }
  return parseState(state)
}

async function getTokensUnsorted(query: string | undefined) {
  return todo<Token[]>()
}

const test_getTokenInfos = (params: GetTokens) => async (state: State) => {
  const { sessions } = await getTokens(params)(state)
  if (params.query) {
    const session = ensureByIndex(sessions, params.sessionId)
    if (session.page.type !== 'TokenInfoTable') throw new Error()
    expect(session.page.rows.every(({ data }) => includesCaseInsensitive(data.name, ensure(params.query))))
  }
}

const includesCaseInsensitive = (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase())
