import { Balance } from './models/Balance'
import { Blockchain } from './models/Blockchain'
import { Fairpool } from './models/Fairpool'
import { State } from './models/State'

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
const cleanBalances = (balances: Balance[]) => balances.filter(b => b.amount != 0n)
