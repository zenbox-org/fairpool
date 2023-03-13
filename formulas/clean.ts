import { Balance as ImBalance } from './models/Balance'
import { Blockchain, Fairpool, State } from './uni'

export const cleanState = ({ fairpools, blockchain }: State): State => ({
  fairpools: cleanFairpools(fairpools),
  blockchain: cleanBlockchain(blockchain),
})

const cleanFairpools = (fairpools: Fairpool[]) => fairpools.map(cleanFairpool)

const cleanBlockchain = (blockchain: Blockchain): Blockchain => ({
  ...blockchain,
  balances: cleanBalances(blockchain.balances),
})

const cleanFairpool = (fairpool: Fairpool): Fairpool => ({
  ...fairpool,
  balances: cleanBalances(fairpool.balances),
  tallies: cleanBalances(fairpool.tallies),
})

/**
 * Filter out empty balances
 */
const cleanBalances = (balances: ImBalance[]) => balances.filter(b => b.amount != 0n)
