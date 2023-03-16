import { isEqualSC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { identity } from 'remeda'
import { z } from 'zod'

export const AddressSchema = z.string().min(1).describe('Address')

export const AddressesSchema = getArraySchema(AddressSchema, identity)

export type Address = z.infer<typeof AddressSchema>

export const parseAddress = (address: Address): Address => AddressSchema.parse(address)

export const parseAddresses = (addresses: Address[]): Address[] => AddressesSchema.parse(addresses)

export const isEqualAddress = isEqualSC
