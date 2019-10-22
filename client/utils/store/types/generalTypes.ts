import { HomeState } from './homeTypes'
import { RecordsState } from './recordsTypes'
import { RouterState } from './routerTypes'
import { SumOfRanksState } from './sumOfRanksTypes'

export type Store = {
    home: HomeState
    records: RecordsState
    routerInfo: RouterState
    sumOfRanks: SumOfRanksState
}