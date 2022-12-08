import { sortBy } from 'lodash-es'
import { expect } from 'libs/utils/chai'
import { todo } from 'libs/utils/todo'
import { TokenInfo } from '../models/TokenInfo'

export async function getTokenInfos(query: string | undefined) {
  const infos = await getTokenInfosUnsorted(query)
  return sortBy(infos, t => t.quoteDailyVolume.toNumber())
}

async function getTokenInfosUnsorted(query: string | undefined) {
  return todo<TokenInfo[]>()
}

async function test_getTokenInfos(query: string | undefined) {
  const infos = await getTokenInfos(query)
  if (query) {
    expect(infos.every(i => includesCaseInsensitive(i.token.name, query)))
  }
}

const includesCaseInsensitive = (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase())
