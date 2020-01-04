import { Reducer, Action } from 'redux'

import { Leaderboard, LeaderboardsCollection } from '../../types'
import { LeaderboardItem, LeaderboardEvent, LeaderboardData } from '../../types/leaderboards'
import { CommonUser } from '../../types/common'

export type LeaderboardsCollectionState = {
    collection: LeaderboardsCollection | "loading"
}

export type LeaderboardState = {
    data: LeaderboardData | "loading"
    leaderboard: Leaderboard | "loading"
    currentActiveEvent: LeaderboardEvent | "none"
    overall: LeaderboardTableRowOverall[] | "none"
}

export type LeaderboardTableRowOverall = {
    user: CommonUser
    points: number
}

export type LeaderboardCollectionAction = Action<"NONE"> |
    Action<"FETCH_ALL_LEADERBOARD_COMPETITIONS"> & { collection: LeaderboardsCollection }

export type LeaderboardAction = Action<"NONE"> |
    Action<"FETCH_COMPETITION_LEADERBOARD"> & { data: LeaderboardData } |
    Action<"SET_ACTIVE_EVENT"> & { event: LeaderboardEvent, leaderboard: Leaderboard } |
    Action<"UPDATE_LEADERBOARD_TABLE_ROW"> & { row: LeaderboardItem } |
    Action<"SET_LEADERBOARD_OVERALL"> & { overall: LeaderboardTableRowOverall[] }
