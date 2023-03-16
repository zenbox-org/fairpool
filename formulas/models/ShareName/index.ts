import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { string, z } from 'zod'

export const ShareNameSchema = string().min(1).describe('ShareName')

export const ShareNamesSchema = getArraySchema(ShareNameSchema, identity)

export type ShareName = z.infer<typeof ShareNameSchema>

export const parseShareName = (name: ShareName): ShareName => ShareNameSchema.parse(name)

export const parseShareNames = (names: ShareName[]): ShareName[] => ShareNamesSchema.parse(names)

export const isEqualShareName = isEqualSC
