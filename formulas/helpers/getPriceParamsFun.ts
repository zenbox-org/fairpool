import { PriceParams } from '../models/PriceParams'

export const getPriceParamsFun = <Rest>(f: (baseLimit: bigint, quoteOffset: bigint) => Rest) => (params: PriceParams) => f(params.baseLimit, params.quoteOffset)
