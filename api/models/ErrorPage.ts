import { z } from 'zod'
import { ErrorSchema } from './Error'

export const ErrorPageSchema = z.object({
  type: z.literal('ErrorPage'),
  error: ErrorSchema,
}).describe('ErrorPage')

export type ErrorPage = z.infer<typeof ErrorPageSchema>

export function parseErrorPage(page: ErrorPage): ErrorPage {
  return ErrorPageSchema.parse(page)
}
