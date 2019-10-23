import { HomeState } from './homeTypes'
import { RecordsState } from './recordsTypes'
import { RouterState } from './routerTypes'
import { SumOfRanksState } from './sumOfRanksTypes'
import { LeaderboardsCollectionState } from './leaderboardTypes'

export type Store = {
    home: HomeState
    records: RecordsState
    routerInfo: RouterState
    sumOfRanks: SumOfRanksState
    leaderboardCollection: LeaderboardsCollectionState
}