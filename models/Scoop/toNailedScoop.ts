import { NonEmptyScoops, parseNonEmptyScoops, parseScoop, Scoop } from '../Scoop'
import { nail, nailMB } from '../../../utils/string'

export function toNailedScoop(scoop: Scoop) {
  const { title, description, proposition } = scoop
  return parseScoop({
    ...scoop,
    title: nail(title),
    description: nailMB(description),
    proposition: nailMB(proposition),
  })
}

export function toNailedNonEmptyScoops(scoops: NonEmptyScoops) {
  return parseNonEmptyScoops(scoops.map(toNailedScoop))
}
