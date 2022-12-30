import { z } from 'zod'
import { getArraySchema } from 'libs/utils/zod'
import { isEqualByDC } from 'libs/utils/lodash'
import { TokenInfoSchema } from './TokenInfo'
import { TokenParamsSchema } from './TokenParams'

export const TokenBlueprintSchema = z.object({})
  .merge(TokenParamsSchema)
  .merge(TokenInfoSchema)
  .describe('TokenBlueprint')

export const TokenBlueprintUidSchema = TokenBlueprintSchema.pick({
  slug: true,
})

export const TokenBlueprintsSchema = getArraySchema(TokenBlueprintSchema, parseTokenBlueprintUid)

export type TokenBlueprint = z.infer<typeof TokenBlueprintSchema>

export type TokenBlueprintUid = z.infer<typeof TokenBlueprintUidSchema>

export function parseTokenBlueprint(blueprint: TokenBlueprint): TokenBlueprint {
  return TokenBlueprintSchema.parse(blueprint)
}

export function parseTokenBlueprints(blueprints: TokenBlueprint[]): TokenBlueprint[] {
  return TokenBlueprintsSchema.parse(blueprints)
}

export function parseTokenBlueprintUid(blueprintUid: TokenBlueprintUid): TokenBlueprintUid {
  return TokenBlueprintUidSchema.parse(blueprintUid)
}

export const isEqualTokenBlueprint = isEqualByDC(parseTokenBlueprintUid)
