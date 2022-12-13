import { z } from 'zod'

export const HomeSchema = z.object({
  type: z.literal('Home'),
}).describe('Home')

export type Home = z.infer<typeof HomeSchema>

export function parseHome(home: Home): Home {
  return HomeSchema.parse(home)
}
