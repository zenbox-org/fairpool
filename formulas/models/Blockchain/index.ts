import { isEqualByDC } from 'libs/utils/lodash'
import { getArraySchema } from 'libs/utils/zod'
import { z } from 'zod'
import { BalancesSchema } from '../Balance'

export const BlockchainSchema = z.object({
  balances: BalancesSchema,
}).describe('Blockchain')

export const BlockchainUidSchema = BlockchainSchema.pick({

})

export const BlockchainsSchema = getArraySchema(BlockchainSchema, parseBlockchainUid)

export type Blockchain = z.infer<typeof BlockchainSchema>

export type BlockchainUid = z.infer<typeof BlockchainUidSchema>

export function parseBlockchain(blockchain: Blockchain): Blockchain {
  return BlockchainSchema.parse(blockchain)
}

export function parseBlockchains(blockchains: Blockchain[]): Blockchain[] {
  return BlockchainsSchema.parse(blockchains)
}

export function parseBlockchainUid(blockchainUid: BlockchainUid): BlockchainUid {
  return BlockchainUidSchema.parse(blockchainUid)
}

export const isEqualBlockchain = isEqualByDC(parseBlockchainUid)
