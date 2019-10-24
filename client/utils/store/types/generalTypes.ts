import { HomeState } from './homeTypes'
import { RecordsState } from './recordsTypes'
import { RouterState } from './routerTypes'
import { SumOfRanksState } from './sumOfRanksTypes'
import { LeaderboardsCollectionState, LeaderboardState } from './leaderboardTypes'
import { ProfileState } from './profileTypes'

export type Store = {
    home: HomeState
    records: RecordsState
    routerInfo: RouterState
    sumOfRanks: SumOfRanksState
    leaderboardCollection: LeaderboardsCollectionState
    leaderboard: LeaderboardState
    profile: ProfileState
}