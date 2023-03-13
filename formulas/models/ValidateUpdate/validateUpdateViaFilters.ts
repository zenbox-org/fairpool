import { BiFilter } from '../../../../generic/models/Filter'

export const validateUpdateViaFilters = <Value, Action>(filters: BiFilter<Value>[]) => (prev: Value, next: Value, action: Action) => {
  const match = filters.find(f => f(prev, next))
  return match ? [] : [new Error('No matching filter')]
}
