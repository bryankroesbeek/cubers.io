import { HomeState, HomeAction } from './homeTypes'
import { RecordsState, RecordsAction } from './recordsTypes'
import { BaseState, BaseAction } from './baseTypes'
import { SumOfRanksState, SumOfRanksAction } from './sumOfRanksTypes'
import { LeaderboardsCollectionState, LeaderboardState, LeaderboardAction, LeaderboardCollectionAction } from './leaderboardTypes'
import { ProfileState, ProfileAction } from './profileTypes'
import { VersusState, VersusAction } from './versusTypes'
import { UserSettingsState, SettingsAction } from './settingsTypes'
import { CompeteState, CompeteAction } from './competeTypes'
import { PromptState, PromptAction } from './promptTypes'

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
    compete: CompeteState
    prompt: PromptState
}