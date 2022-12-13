import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { IdxSchema } from '../../../generic/models/Idx'
import { PageSchema } from './Page'

export const SessionSchema = z.object({
  userId: IdxSchema,
  page: PageSchema,
}).describe('Session')

export const SessionsSchema = getArraySchema(SessionSchema, parseSessionUid)

export const SessionUidSchema = SessionSchema.pick({
  userId: true,
})

export type Session = z.infer<typeof SessionSchema>

export type SessionUid = z.infer<typeof SessionUidSchema>

export function parseSession(session: Session): Session {
  return SessionSchema.parse(session)
}

export function parseSessions(sessions: Session[]): Session[] {
  return SessionsSchema.parse(sessions)
}

export function parseSessionUid(sessionUid: SessionUid): SessionUid {
  return SessionUidSchema.parse(sessionUid)
}

export const isEqualSession = isEqualByDC(parseSessionUid)
