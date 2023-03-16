import { map } from 'remeda'
import { toFintGenTuple } from '../../../../finance/models/FintGen/toFintGenTuple'
import { getFinder } from '../../../../utils/ensure'
import { History } from '../../../../utils/History'
import { byAssetWallet } from '../../helpers/byAssetWallet'
import { Fint } from './index'

export const getFintRendered = (fint: Fint) => toFintGenTuple(fint).map(v => v.toString())

export const getFintsRendered = map(getFintRendered)

export const getFintsHistory = (asset: string, sender: string) => (history: History<Fint[]>) => history.map(getFinder(byAssetWallet(asset, sender)))
