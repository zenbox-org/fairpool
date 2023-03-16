import { sumAmounts } from 'libs/utils/bigint/BigIntAdvancedOperations'
import { pipe } from 'remeda'
import { Asset } from '../models/Asset'
import { Fairpool } from '../models/Fairpool'
import { Fint } from '../models/Fint'

export const getTotalSupply = sumAmounts

export const getTotalSupplyR = (asset: Asset) => (fints: Fint[]) => pipe(fints.filter(b => b.asset === asset), getTotalSupply)

export const getTotalSupplyF = (fairpool: Fairpool) => getTotalSupply(fairpool.balances)
