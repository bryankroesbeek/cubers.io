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
    data: "loading",
    leaderboard: "loading"
}

export const leaderboardReducer: Reducer<LeaderboardState, LeaderboardAction> = (state = initialLeaderboardState, action): LeaderboardState => {
    if (action.type === "FETCH_COMPETITION_LEADERBOARD") {
        return { ...state, data: action.data }
    }
    if (action.type === "SET_ACTIVE_EVENT") {
        return { ...state, leaderboard: action.leaderboard, currentActiveEvent: action.event }
    }
    if (action.type === "UPDATE_LEADERBOARD_TABLE_ROW") {
        if (state.leaderboard === "loading") return state
        let currentRows = [...state.leaderboard.results]
        let currentItem = currentRows.filter(r => r.solve.id === action.row.solve.id)[0]
        let index = currentRows.indexOf(currentItem)
        currentRows[index] = action.row
        return { ...state, leaderboard: { ...state.leaderboard, results: currentRows } }
    }

    return state
}