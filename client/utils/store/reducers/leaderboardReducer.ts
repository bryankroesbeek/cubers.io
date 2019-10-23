import { Reducer, Action } from 'redux'

import { LeaderboardCollectionAction, LeaderboardsCollectionState, LeaderboardAction, LeaderboardState } from '../types/leaderboardTypes'

const initialState: LeaderboardsCollectionState = {
    collection: "loading"
}

export const leaderboardCollectionReducer: Reducer<LeaderboardsCollectionState, LeaderboardCollectionAction> = (state = initialState, action): LeaderboardsCollectionState => {
    if (action.type === "FETCH_ALL_LEADERBOARD_COMPETITIONS") {
        return { ...state, collection: action.collection }
    }

    return state
}

const initialLeaderboardState: LeaderboardState = {
    currentActiveEvent: "none",
    events: "loading",
    leaderboard: "loading"
}

export const leaderboardReducer: Reducer<LeaderboardState, LeaderboardAction> = (state = initialLeaderboardState, action): LeaderboardState => {
    if (action.type === "FETCH_COMPETITION_LEADERBOARD") {
        return { ...state, events: action.events }
    }
    if (action.type === "SET_ACTIVE_EVENT") {
        return { ...state, leaderboard: action.leaderboard, currentActiveEvent: action.event }
    }

    return state
}