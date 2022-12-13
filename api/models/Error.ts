import { z } from 'zod'

export const ErrorSchema = z.object({
  
}).describe('Error')

export type Error = z.infer<typeof ErrorSchema>

export function parseError(error: Error): Error {
  return ErrorSchema.parse(error)
}

export const isError = (e: unknown) => ErrorSchema.safeParse(e).success
