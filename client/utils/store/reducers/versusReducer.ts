import { Reducer, Action } from 'redux'

import { VersusAction, VersusState } from '../types/versusTypes'

const initialState: VersusState = {
    user1Rankings: "loading",
    user1Records: "loading",
    user2Rankings: "loading",
    user2Records: "loading"
}

export const versusReducer: Reducer<VersusState, VersusAction> = (state = initialState, action): VersusState => {
    switch (action.type) {
        case "FETCH_PROFILE_1_STATISTICS":
            return { ...state, user1Rankings: action.user1Rankings }

        case "FETCH_PROFILE_1_RECORDS":
            return { ...state, user1Records: action.user1Records }

        case "FETCH_PROFILE_2_STATISTICS":
            return { ...state, user2Rankings: action.user2Rankings }

        case "FETCH_PROFILE_2_RECORDS":
            return { ...state, user2Records: action.user2Records }
    }

    return state
}