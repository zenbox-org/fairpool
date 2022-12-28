import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualSC } from 'libs/utils/lodash'
import { identity } from 'lodash-es'

const allowedSymbols = ['\\w', '\\d', '_']

const regexp = new RegExp(`^[${(allowedSymbols.join(''))}]+$`)

export const TokenSlugSchema = z.string()
  .min(3)
  .max(60)
  .regex(regexp)
  .describe('TokenSlug')

export const TokenSlugsSchema = getArraySchema(TokenSlugSchema, identity)

export type TokenSlug = z.infer<typeof TokenSlugSchema>

export const parseTokenSlug = (slug: TokenSlug): TokenSlug => TokenSlugSchema.parse(slug)

export const parseTokenSlugs = (s: TokenSlug[]): TokenSlug[] => TokenSlugsSchema.parse(s)

export const isEqualTokenSlug = isEqualSC
