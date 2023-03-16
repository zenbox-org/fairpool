import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { z } from 'zod'
import { AddressSchema } from '../Address'

export const OwnerSchema = AddressSchema.describe('Owner')

export const OwnersSchema = getArraySchema(OwnerSchema, identity)

export type Owner = z.infer<typeof OwnerSchema>

export const parseOwner = (owner: Owner): Owner => OwnerSchema.parse(owner)

export const parseOwners = (owners: Owner[]): Owner[] => OwnersSchema.parse(owners)

export const isEqualOwner = isEqualSC
