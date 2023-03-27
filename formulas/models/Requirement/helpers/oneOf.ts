import { Requirement } from '../../../../../programming/models/Requirement'

export const oneOf = <T>(reqs: Requirement<T>[]) => (history: T[]) => reqs.some(r => r.filter(history))
