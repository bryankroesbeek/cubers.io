import { Reducer, Action } from 'redux'

import { HomeAction, HomeState } from '../types/homeTypes'

const initialState: HomeState = {
    events: "loading"
}

export const homeReducer: Reducer<HomeState, HomeAction> = (state = initialState, action): HomeState => {
    if (action.type === "FETCH_EVENTS") {
        return { ...state, events: action.payload }
    }

    return state
}