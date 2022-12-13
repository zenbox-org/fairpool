import { z } from 'zod'

export const TokenActionSchema = z.object({

}).describe('TokenAction')

export type TokenAction = z.infer<typeof TokenActionSchema>

export function parseTokenAction(action: TokenAction): TokenAction {
  return TokenActionSchema.parse(action)
}
