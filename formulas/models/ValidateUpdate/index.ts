import { ZodError } from 'zod'

export type ValidateUpdate<Value, Action, Error> = (prev: Value, next: Value, action: Action) => Error[]

export type ValidateUpdatePlain<Value, Action> = ValidateUpdate<Value, Action, Error>

export type ValidateUpdateZod<Value, Action> = ValidateUpdate<Value, Action, ZodError>
