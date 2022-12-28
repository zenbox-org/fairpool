import { getFinder, getInserter, getName } from 'libs/utils/zod'
import { parseTokenInfoUid, TokenInfo, TokenInfoSchema } from '../models/TokenInfo'

export const allTokenInfos: TokenInfo[] = []

export const addTokenInfo = getInserter(getName(TokenInfoSchema), TokenInfoSchema, parseTokenInfoUid, allTokenInfos)

export const findTokenInfo = getFinder(parseTokenInfoUid, allTokenInfos)

// allInfluencers.map(toTokenInfo)
