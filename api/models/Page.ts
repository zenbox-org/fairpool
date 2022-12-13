import { z } from 'zod'
import { ErrorPageSchema } from './ErrorPage'
import { HomeSchema } from './Home'
import { TokenInfoTableSchema } from './TokenInfoTable'

export const PageSchema = z.discriminatedUnion('type', [
  ErrorPageSchema,
  HomeSchema,
  TokenInfoTableSchema,
]).describe('Page')

export type Page = z.infer<typeof PageSchema>

export function parsePage(session: Page): Page {
  return PageSchema.parse(session)
}
