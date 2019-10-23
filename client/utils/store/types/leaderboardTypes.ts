import { Reducer, Action } from 'redux'

import { Leaderboard, LeaderboardsCollection } from '../../types'
import { LeaderboardItem, LeaderboardEvent } from '../../types/leaderboards'

export type LeaderboardsCollectionState = {
    collection: LeaderboardsCollection | "loading"
}

export type LeaderboardState = {
    events: LeaderboardEvent[] | "loading"
    leaderboard: Leaderboard | "loading"
    currentActiveEvent: LeaderboardEvent | "none"
}

export type LeaderboardCollectionAction = Action<"NONE"> |
    Action<"FETCH_ALL_LEADERBOARD_COMPETITIONS"> & { collection: LeaderboardsCollection }

export type LeaderboardAction = Action<"NONE"> |
    Action<"FETCH_COMPETITION_LEADERBOARD"> & { events: LeaderboardEvent[] } |
    Action<"SET_ACTIVE_EVENT"> & { event: LeaderboardEvent, leaderboard: Leaderboard }
