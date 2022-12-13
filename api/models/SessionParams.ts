import { z } from 'zod'
import { IdxSchema } from '../../../generic/models/Idx'

export const SessionParamsSchema = z.object({
  sessionId: IdxSchema,
}).describe('SessionParams')

export type SessionParams = z.infer<typeof SessionParamsSchema>

export function parseSessionParams(params: SessionParams): SessionParams {
  return SessionParamsSchema.parse(params)
}
