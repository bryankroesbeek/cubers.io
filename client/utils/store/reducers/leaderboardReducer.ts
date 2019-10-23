import { Reducer, Action } from 'redux'

import { LeaderboardCollectionAction, LeaderboardsCollectionState } from '../types/leaderboardTypes'

const initialState: LeaderboardsCollectionState = {
    collection: "loading"
}

export const leaderboardCollectionReducer: Reducer<LeaderboardsCollectionState, LeaderboardCollectionAction> = (state = initialState, action): LeaderboardsCollectionState => {
    if (action.type === "FETCH_ALL_LEADERBOARD_COMPETITIONS") {
        return { ...state, collection: action.collection }
    }

    return state
}