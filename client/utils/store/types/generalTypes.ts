import { HomeState } from './homeTypes'
import { RecordsState } from './recordsTypes'
import { BaseState } from './baseTypes'
import { SumOfRanksState } from './sumOfRanksTypes'
import { LeaderboardsCollectionState, LeaderboardState } from './leaderboardTypes'
import { ProfileState } from './profileTypes'
import { VersusState } from './versusTypes'
import { UserSettingsState } from './settingsTypes'

export type Store = {
    home: HomeState
    records: RecordsState
    baseInfo: BaseState
    sumOfRanks: SumOfRanksState
    leaderboardCollection: LeaderboardsCollectionState
    leaderboard: LeaderboardState
    profile: ProfileState
    versus: VersusState
    settings: UserSettingsState
}