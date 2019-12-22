import { Reducer, Action } from 'redux'

import { ProfileAction, ProfileState } from '../types/profileTypes'

const initialState: ProfileState = {
    user: "loading",
    history: "loading",
    rankings: "loading",
    records: "loading",
    selectedEvent: "none"
}

export const profileReducer: Reducer<ProfileState, ProfileAction> = (state = initialState, action): ProfileState => {
    switch (action.type) {
        case "FETCH_PROFILE_INFORMATION":
            return { ...state, user: action.user }

        case "FETCH_PROFILE_STATISTICS":
            return { ...state, rankings: action.statistics }

        case "FETCH_PROFILE_RECORDS":
            return { ...state, records: action.records }

        case "FETCH_PROFILE_HISTORY":
            return { ...state, history: action.history }

        case "SET_ACTIVE_PROFILE_HISTORY_EVENT":
            return { ...state, selectedEvent: action.historyEvent }
    }

    return state
}