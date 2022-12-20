import { bn } from '../../../bn/utils'
import { Address } from '../../../ethereum/models/Address'
import { BalanceUint256BN } from '../../../ethereum/models/BalanceUint256BN'
import { Token } from '../../models/Token'

export function getBalanceD(token: Token, address: Address): BalanceUint256BN {
  const balance = token.balances.find(b => b.address === address)
  return balance ?? {
    address,
    amount: bn(0),
  }
}
