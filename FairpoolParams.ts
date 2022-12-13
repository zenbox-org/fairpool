import { z } from 'zod'

export const FairpoolParamsSchema = z.object({
  sessionId: z.number(),
}).describe('FairpoolParams')

export type FairpoolParams = z.infer<typeof FairpoolParamsSchema>

export function parseFairpoolParams(params: FairpoolParams): FairpoolParams {
  return FairpoolParamsSchema.parse(params)
}
