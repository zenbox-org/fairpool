import { todo } from '../../../../utils/todo'
import { HieroShare } from '../HieroShare'
import { Fairpool } from './index'

export const getHieroShares = (fairpool: Fairpool) => todo<HieroShare[]>()
