import { bigInt } from 'fast-check'

export const bigintNatArb = bigInt({ min: 0n })
