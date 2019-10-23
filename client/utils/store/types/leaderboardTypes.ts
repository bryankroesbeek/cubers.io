import { Reducer, Action } from 'redux'

import { Leaderboard, LeaderboardsCollection } from '../../types'
import { Leaderboards } from '../../../Components/Leaderboards/Leaderboards'

export type LeaderboardsCollectionState = {
    collection: LeaderboardsCollection | "loading"
}

export type LeaderboardCollectionAction = Action<"NONE"> |
    Action<"FETCH_ALL_LEADERBOARD_COMPETITIONS"> & { collection: LeaderboardsCollection }

export type LeaderboardAction = Action<"NONE"> |
    Action<"FETCH_COMPETITION_LEADERBOARD"> & { leaderboard: Leaderboards }
